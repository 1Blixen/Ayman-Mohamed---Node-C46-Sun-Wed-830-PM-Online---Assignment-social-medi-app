import { string } from "zod"
import { createPostData } from "./post.validation"
import { Types } from "mongoose"
import { postModel } from "./post.model"
import { HUser } from "../user/types/users.types"
import { friendRequestModel } from "../user/models/friendRequest.model"
import { FriendRequestEnum } from "../user/types/friendRequest.types"
import { privacyEnum } from "./post.types"
import { userServices } from "../user/user.services"

class PostServices {



    async createPost ({content , title , privacy , userId}:createPostData & {userId:string|Types.ObjectId}){
        const post = await postModel.create({
            content,
            createdBy:userId,
            title,
            privacy  
        })

        return {data : {
            post
        }
        }
    }


    async getPostByUserId({userId , user}:{userId:string|Types.ObjectId , user:HUser}){

        const isFriends = await friendRequestModel.findOne({status: FriendRequestEnum.accepted,
            $or:[
                {
                    to:userId,
                    from:user._id
                },{
                    to:user._id,
                    from:userId
                }

            ]

        })

        const postsPrivacy = [
            {privacy : privacyEnum.public}
        ]
        
        if(isFriends){
            postsPrivacy.push({privacy : privacyEnum.friends})
        }

        if(userId == user._id.toString()){
           postsPrivacy.push( {privacy : privacyEnum.private}, {privacy : privacyEnum.friends})
           
        }

        const posts = await postModel.find({
            createdBy:userId ,
            $or : postsPrivacy
        })

        return {
            data:{
                posts
            }
        }
    }


    async getHomePage({user}:{user:HUser}){

        const friends = (await userServices.listFriends({userId:user.id})).data.friends.map(friend=>friend._id)
        const privacy = [
            {privacy : privacyEnum.public},
            {
                privacy : privacyEnum.friends,
                $in:friends
            },{
                privacy : {$in: [privacyEnum.private , privacyEnum.friends]},
                createdBy : user._id
            }
        ]
        const posts = await postModel.find({
            $or:privacy
        })

   
    return{
        data:{
            posts
        }
    } 
}

}



export const postServices = new PostServices()