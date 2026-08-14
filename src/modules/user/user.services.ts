import { BadRequestException, NotFoundException, UnAuthorizedException } from "../../utils/error.exceptions";
import { friendRequestModel } from "./models/friendRequest.model";
import { UserModel } from "./models/user.model";
import { FriendRequestEnum } from "./types/friendRequest.types";
import { friendRequestReplyData, sendFriendRequestData } from "./user.validation";

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


    




}

export const userServices = new UserServices()