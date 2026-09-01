import { Types } from "mongoose";
import { HUser } from "../user/types/users.types";
import { BadRequestException, NotFoundException } from "../../utils/error.exceptions";
import { UserModel } from "../user/models/user.model";
import { backgroundColorNames } from "chalk";
import { followModel } from "./follow.model";




export class FollowServices{

    async followUser({user}:{user:HUser}, targetId:string|Types.ObjectId){ 
        
        if(user.id == targetId.toString()){
            throw new BadRequestException("Can't follow yourself")
        }
        const targetUser = await UserModel.findById(targetId)

        if (!targetUser){
            throw new BadRequestException("Can't follow a non-existent user")
        }

        const isFollowing = await followModel.findOne({
            follower : user._id , 
            following:targetId
        })

        if(isFollowing){
            throw new BadRequestException("Already following")
        }

        const follow = await followModel.create({
            follower:user._id , 
            following: targetId
        })

        return{
            data:{
                follow
            }
        }
    }



    async unFollow({user}:{user:HUser} , targetId:string|Types.ObjectId){


        if(user.id == targetId.toString()){
            throw new BadRequestException("Cannot unfollow yourself")
        }
        const target = await UserModel.findById(targetId)
        if(!target){
            throw new NotFoundException("User not found")
        }

        const follow = await followModel.findOne({
            follower:user._id,
            following:targetId
        })

        if(!follow){
            throw new BadRequestException("Not followed to unfollow")
        }
        await followModel.deleteOne(follow)
        
        return{
            data:{}
        }
    }

}



export const followServices = new FollowServices()