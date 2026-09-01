import { NextFunction, Request, Response } from "express"
import { BadRequestException, UnAuthorizedException } from "../utils/error.exceptions"
import { verifyToken } from "../utils/security/token"
import { UserModel } from "../modules/user/models/user.model"
import { jwtIdKey } from "../utils/redis/redis.services"
import { redisClient } from "../db/redis.connection"
import { IUser , HUser } from "../modules/user/types/users.types"


export enum TokenEnum {
    access ,
    refresh
}

declare module "express-serve-static-core" {
    interface Request {
        user : HUser
    }
}


declare module "socket.io"{
    interface Socket { 
        user:HUser
    }
}

export const auth = async (req:Request , res:Response , next : NextFunction)=>{
    const { authorization } = req.headers
    const {user} = await decodeToken({authorization : authorization as string, tokenType:TokenEnum.access})
    req.user = user
    next()
}

export const decodeToken = async ({authorization , tokenType = TokenEnum.access} : {authorization : string , tokenType? : TokenEnum})=>{
    if(!authorization){
        throw new UnAuthorizedException()
    }
    if(!authorization.startsWith("Bearer")){
        throw new BadRequestException("Invalid authorization type")
    }
    const token = authorization.split(" ")[1]

    if(!token){
        throw new UnAuthorizedException()
    }

    const payload  = verifyToken(token , tokenType == TokenEnum.access ? 
        process.env.ACCES_JWT_SECRET as string
         : process.env.REFRESH_JWT_SECRET as string 

    ) as {
        _id: "6a7c955c0f86c55b6d991e36",
        iat: 1786636827,
        exp: 1786638627,
        jti: "rZ3x2lVLApRa1va-0zqX"
    }

    const user = await UserModel.findById(payload._id)

    if(!user){
        throw new UnAuthorizedException()
    }

    if(!user.confirmedAt){
        throw new UnAuthorizedException()
    }

    const sessionKey = jwtIdKey(user.id , payload.jti)
    const session = await redisClient.get(sessionKey)
    if(!session){
        throw new UnAuthorizedException
    }


    return {user}
}