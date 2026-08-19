import { Types } from "mongoose";
import { BadRequestException, NotFoundException, UnAuthorizedException } from "../../utils/error.exceptions";
import { friendRequestModel } from "./models/friendRequest.model";
import { UserModel } from "./models/user.model";
import { FriendRequestEnum } from "./types/friendRequest.types";
import { cancelFriendRequestData, friendRequestReplyData, sendFriendRequestData } from "./user.validation";

class UserServices {

async sendFriendRequest({to , from}: sendFriendRequestData & {from:string}){
    if(from.toString() == to.toString()){
        throw new BadRequestException("Cannot send a friend request to yourself")
    }
    const reciever = await UserModel.findById(to)
    if(!reciever){
        throw new NotFoundException("User not found")
    }

    const isFriendExist = await friendRequestModel.findOne({
       status:{ $in:[FriendRequestEnum.pending , FriendRequestEnum.accepted]},

       $or:[{from , to} , 
        {to:from , from:to}
       ]
    })

    if(isFriendExist){
        throw new BadRequestException('Friend request already exists')
    }

    friendRequestModel.create({
        from , 
        to
    })

    return{
        data :{}
    }
}


async friendRequestReply({id , status , userId} : friendRequestReplyData &{userId : string}) {
    const friendRequest = await friendRequestModel.findOne({_id :id})

    if(!friendRequest){
        throw new NotFoundException("Friend request not found")
    }

    if(friendRequest.to.toString() != userId ){
        throw new UnAuthorizedException()
    }

    if(friendRequest.status != FriendRequestEnum.pending){
        throw new BadRequestException("status must equal pending")
    }

    friendRequest.status = status
    await friendRequest.save()

    return {
        data : {}
    }

}


async listFriendRequest({userId , isTo = true} : {userId : string|Types.ObjectId , isTo?:boolean} ){

    const filter:{
        to? :string|Types.ObjectId,
        from?: string|Types.ObjectId,
        status: FriendRequestEnum
    } = {
        to:userId , status : FriendRequestEnum.pending
    }

    if(!isTo){
        delete filter.to
        filter.from = userId
    }
    const friendRequests = await friendRequestModel.find(filter)

   

    return {
        data:{
            friendRequests
        }
    }
}



async cancelFriendRequest({userId , id}:{userId:string|Types.ObjectId}&cancelFriendRequestData){
    const friendRequest = await friendRequestModel.findById(id)
    if(!friendRequest){
        throw new NotFoundException("Friend request not found")
    }

    if(friendRequest.from.toString() != userId.toString()){
        throw new UnAuthorizedException()
    }

    if(friendRequest.status != FriendRequestEnum.pending){
        throw new BadRequestException("the status must be pending")
    }

    friendRequest.status = FriendRequestEnum.canceled

    await friendRequest.save()

    return{
        data:{}
    }
}


async listFriends({userId } : {userId : string|Types.ObjectId}){
    const friendRequests = await friendRequestModel.find({
        $or:[{from : userId},
            {to:userId}
        ],
        status:FriendRequestEnum.accepted
    })
    .populate([
        {
            path:"to" , 
            select:"email name phone",
            match:{
                _id:{
                    $ne: userId
                }
            }
    }  ,
{
            path:"from" , 
            select:"email name phone",
            match:{
                _id:{
                    $ne: userId
                }
            }
    }  ,])

    const friends = friendRequests.map(req=>{
        return req.to || req.from
    })
    return {
        data : {friends}
    }
    
}

    




}

export const userServices = new UserServices()