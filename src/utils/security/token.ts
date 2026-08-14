import jwt from "jsonwebtoken"
import { KeyObject } from "node:crypto"

export const generateToken = (payload : string|object ,secretKey: jwt.Secret , options: jwt.SignOptions = {})=> {
    const token =jwt.sign(payload , secretKey , options)
    return token
}


export const verifyToken = (token: string , secretKey: jwt.Secret , options:jwt.VerifyOptions = {}) =>{
    const payLoad = jwt.verify(token , secretKey , options)
    return payLoad
}