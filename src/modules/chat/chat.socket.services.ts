import { Socket } from "socket.io";
import { UserModel } from "../user/models/user.model";
import { NotFoundException } from "../../utils/error.exceptions";
import { chatModel } from "./models/chat.model";
import { redisClient } from "../../db/redis.connection";
import { connectedSocketsKey } from "../../utils/redis/redis.services";




class ChatSocketServices {



    async sendMessage({data,socket}:{socket:Socket , data :{content:string , sendTo:string} }){
        try {
            const createdBy = socket.user._id
            const {content , sendTo } = data
            const friend = await UserModel.findById(sendTo)
            if(!friend){
                throw new NotFoundException("Friend not found")
            }

            const chat = await chatModel.findOne({
                group:{
                    $exists:false
                },
                participants:{
                    $all : [createdBy._id , friend._id]
                }
            })

            if(!chat){
                throw new NotFoundException("Chat not found")
            }

            chat.messages.push({
                createdBy,
                content
            })

            await chat.save()

            socket.emit("successMessage" , content)

           let friendSockets:string|null|string[] = await redisClient.get(connectedSocketsKey(friend.id))

           if(friendSockets){
            socket.to(JSON.parse(friendSockets)).emit("newMessage",{
                content,
                from : socket.user
            })

           }


        } catch (error) {
            console.log(error)
        }
    }
}


export const chatSocketServices = new ChatSocketServices()