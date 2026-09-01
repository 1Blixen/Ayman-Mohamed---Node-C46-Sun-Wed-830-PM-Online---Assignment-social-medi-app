import { model, Schema, Types } from "mongoose";
import { IChat } from "../types/chat.types";
import { IMessage } from "../types/message.types";




export const messageSchema = new Schema<IMessage>({
    createdBy : {
        type : Types.ObjectId,
        requires : true,
        ref:"Users"
    } , 
    content:{
        type:String,
        required: function (this:IMessage){
            return this.attatchments?.length == 0
        }
    },
    attatchments:{
        type:[String]
    }
    
},{   timestamps : true ,
    strictQuery:true,
    strict : true,
    optimisticConcurrency:true,
    toJSON: {getters : true,
        virtuals:true
    },
    toObject: {
        getters:true,
        virtuals : true
    }})



export const chatSchema = new Schema<IChat>({
    participants : {
        type: [Types.ObjectId],
        ref:"User"
        
    },
    messages: {
        type: [messageSchema]
    },
    group:String,
    groupImage:String,
    roomId:{
        type:String , 
        unique:true
    },
    createdBy:{
        type : Types.ObjectId ,
        required: true,
        ref:"User"
    }

},{   timestamps : true ,
    strictQuery:true,
    strict : true,
    optimisticConcurrency:true,
    toJSON: {getters : true,
        virtuals:true
    },
    toObject: {
        getters:true,
        virtuals : true
    }})

export const chatModel = model("Chat" ,chatSchema)