import { number } from "zod";
import { BadRequestException, NotFoundException } from "../../utils/error.exceptions";
import { UserModel } from "../user/models/user.model";
import { confirmEmailData, resendConfirmEmailData, signUpData } from "./auth.validation";
import { sendEmail } from "../../utils/email/sendEmail";
import { createOTP } from "../../utils/email/otp";
import { generateHTML } from "../../utils/email/template";
import { confirmEmailKey, jwtIdKey } from "../../utils/redis/redis.services";
import { redisClient } from "../../db/redis.connection";
import { compare, hash } from "../../utils/security/hash";
import mongoose from "mongoose";
import { notDeepEqual } from "node:assert";
import { backgroundColorNames } from "chalk";
import { loginData } from "./auth.validation";
import { generateToken } from "../../utils/security/token";
import {nanoid} from "nanoid"




class AuthServices{
    



    async signUp(data:signUpData){
        const {name , email , password , gender , bio , phone , age} = data

        const isEmailExist = await UserModel.findOne({email})

        if(isEmailExist){
            throw new BadRequestException("Email alreay exists")
        }

        const user =await UserModel.create({
            name ,
             email , 
             password: await hash(password) , 
             gender , 
             bio , 
             phone , 
             age : age as number
            
        })
        const otp = createOTP()
        await sendEmail({to : email , 
            subject:"confirm email",
            html: generateHTML(otp)
        })
        await redisClient.set(confirmEmailKey(user.id) , otp , {
            EX : 5*60
        })
    
    


        return {
            data : {user}
        }
    }
    
    
     async confirmEmail({email , otp} : confirmEmailData){
          const user = await UserModel.findOne({email , confirmedAt:{
            $exists : false
          }} ) 
          
          if(!user){
            throw new NotFoundException("User not found")
          }
          
        const userOtp = await redisClient.get(confirmEmailKey(user.id))
       
        if(!userOtp){
            throw new BadRequestException("OTP expired")
        }

        if(userOtp != otp){
            throw new BadRequestException("Invalid OTP")
        }
        
        user.confirmedAt = new Date()
        await redisClient.del(confirmEmailKey(user.id))
        await user.save()
        return {
            data:{}
        }
    }


    async resendOTP ({email} : resendConfirmEmailData){

        const user = await UserModel.findOne({email})

        if(!user){
            throw new NotFoundException("User not found")
        }

        if(user?.confirmedAt){
            throw new BadRequestException("already confirmed")
        }
        const key = confirmEmailKey(user.id)
        const oldOTP = await redisClient.get(key)

        if(oldOTP){
            const ttl = await redisClient.ttl(key) 
            throw new BadRequestException(`Wait ${Math.ceil(ttl/60)} minutes to resend OTP` )
        }

        const otp = createOTP()
        await sendEmail({to : email , 
            subject:"resend confirm email OTP",
            html: generateHTML(otp)
        })
        await redisClient.set(confirmEmailKey(user.id) , otp , {
            EX : 5*60
        })

        return{
            data : {}
        }

    }



    async login ({email , password}:loginData){
        const isEmailExist = await UserModel.findOne({email})
        if(!isEmailExist){
             throw new BadRequestException("Invalid credintials")
        }
        if(!isEmailExist.confirmedAt){
            throw new BadRequestException("Email is not confirmed")
        }
        const isMatch = await compare(password ,isEmailExist.password )

        if(!isMatch){
            throw new BadRequestException("Invalid credintials")
        }

        const jwtid = nanoid(20)

        const accessToken = generateToken({
            _id : isEmailExist._id
        }
        ,process.env.ACCES_JWT_SECRET as string ,
    {
        expiresIn : "30m" ,
        jwtid
    })

    const refreshToken = generateToken({
            _id : isEmailExist._id
        }
        ,process.env.REFRESH_JWT_SECRET as string ,
    {
        expiresIn : "7D" ,
        jwtid
    })


    await redisClient.set(jwtIdKey(isEmailExist.id , jwtid) , jwtid)


    return{
        data :{
            accessToken,
            refreshToken
        }
    }
    }

}




export const authServices = new AuthServices()