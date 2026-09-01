import { nanoid } from "nanoid";
import { NotFoundException } from "../../utils/error.exceptions";
import { UserModel } from "../user/models/user.model";
import { HUser } from "../user/types/users.types";
import { chatModel } from "./models/chat.model";





class ChatServices{


    async getChat({user , id}:{user:HUser , id:string}){
        const friend = await UserModel.findById(id)
        if(!friend){
            throw new NotFoundException("Chat not found")
        }


        let chat = await chatModel.findOne({
            group:{
                $exists:false
            },
            participants:{
                $all : [user._id , friend._id]
            }
        }).populate('participants')

        if(!chat){
            chat = await chatModel.create({
                participants:[user._id , friend._id],
                createdBy:user._id
            } )
        }

        return {
            data :{
                chat
            }
        }
    }




    async createGroup({group , participants, user}:{group:string , participants:string[] , user:HUser}){

        const foundParticipants = await UserModel.find({
              _id:{
            $in:participants
        }
        })
          

        if(participants.length != foundParticipants.length){
            throw new NotFoundException("Some participants not found")
        }
        const roomId = nanoid(15)

        const newGroup = await chatModel.create({
            participants,
            group,
            createdBy: user._id,
            roomId
        })


        return {
            data :{
                group:newGroup
            }
        }
    }


}





export const chatServices = new ChatServices()