import express, { NextFunction } from 'express'
import chalk from "chalk"
import morgan from "morgan"
import {Request , Response} from 'express'
import { DBConnection } from './db/mongoose.connection'
import { BadRequestException, IError, NotFoundException, ValidationExceptions } from './utils/error.exceptions'
import * as z from 'zod'
import authRouter from './modules/auth/auth.controller'
import { routes as authRoutes } from './modules/auth/auth.controller'
import { createOTP } from './utils/email/otp'
import { redisClient } from './db/redis.connection'
import userRouter from "./modules/user/user.controller"
import { routes as userRoutes } from './modules/user/user.controller'



const app = express()


export const bootstrap = async ()=>{

    app.use(express.json())
    app.use(morgan("dev"))
    app.use(authRoutes.base , authRouter)
    app.use(userRoutes.base , userRouter)

    app.get("/hello" , (req,res)=>{
        throw new NotFoundException('not found')
    })

    await DBConnection()
    await redisClient.connect()
    app.use((err : IError , req : Request , res: Response , next : NextFunction) =>{
        const statusCode = err.statusCode || 500
        res.status(err.statusCode || 500 ).json({
            errMessage : err.message ,
            ValidationError : err.validationError,
            status : statusCode ,
            stack : err.stack
        })

    })






    app.listen(process.env.PORT , ()=>{
        console.log(chalk.bgGreen.blue(`Server is running on port ${process.env.PORT}`));
        
    })
}