import { Types } from "mongoose";



export interface IMessage {
    createdBy : Types.ObjectId,
    content : string , 
    attatchments? : string[]
    createdAt? : Date , 
    updatedAt? : Date
}