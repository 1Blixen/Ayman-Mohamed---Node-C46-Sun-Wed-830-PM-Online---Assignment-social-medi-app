import type {Response} from "express";


export const successRes = ({res , data={} , statusCode=200 , message }:{res : Response, data?: string|object, message ?: string|boolean  , statusCode?: number}) => {
 return res.status(statusCode).json({
    message,
    data,
    statusCode,
    timeStamp: new Date()

 })
}