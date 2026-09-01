import { iso, string } from "zod"
import { createPostData, updatePostData } from "./post.validation"
import { Types } from "mongoose"
import { postModel } from "./post.model"
import { HUser } from "../user/types/users.types"
import { friendRequestModel } from "../user/models/friendRequest.model"
import { FriendRequestEnum } from "../user/types/friendRequest.types"
import { privacyEnum } from "./post.types"
import { userServices } from "../user/user.services"
import { BadRequestException, NotFoundException, UnAuthorizedException } from "../../utils/error.exceptions"
import { notDeepEqual } from "node:assert"

class PostServices {

     deletedPosts: string[] = []

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


async deletePost ({user} : {user:HUser} , postId:string ){
    const post = await postModel.findById(postId)
    if(!post){
        throw new NotFoundException("Post not found")
    }
    if(user.id != post.createdBy.toString()){
        throw new UnAuthorizedException()
    }
    await postModel.findByIdAndDelete(postId)
    return{
        data:{}
    }
}

async getPost(postId:string|Types.ObjectId, {user}:{user:HUser} ){
    const post = await postModel.findById(postId)

    if(!post){
        throw new NotFoundException("Post not found")
    }

    const owner = user.id == post?.createdBy.toString()

    const likeCount = post.likes.length

    const likedByMe = post.likes.includes(user._id)


    if(owner){
        return {
            data: {post,
            likedByMe,
            likeCount}
        }
    }
    

    if(post.privacy == privacyEnum.public){
        return {data:{
            post,
    likedByMe,
likeCount
        }}
    }
    const isFriend = await friendRequestModel.findOne({status: FriendRequestEnum.accepted,
        $or:[{
            from:post?.createdBy,
            to:user._id
        },
    {
        from:user._id,
        to:post?.createdBy
    }]
})
    if(isFriend && post.privacy == privacyEnum.friends){
        return{data:{post,
        likedByMe,
        likeCount}
    , }
    }

    throw new UnAuthorizedException()

}


async likePost({user}:{user:HUser} ,postId:Types.ObjectId|string ){
    const post = await postModel.findById(postId)

    if(!post){
        throw new NotFoundException("Post not found")
    }

    if(post.likes.includes(user._id)){
        throw new BadRequestException("Already liked")
    }
    post.likes.push(user._id)
    await post.save()

    return {
        data:{
            post
        }
    }
}



async unLike({user}:{user:HUser} , postId:Types.ObjectId|string){
    const post = await postModel.findById(postId)

    if(!post){
        throw new NotFoundException("Post not found")
    }

    const likedByMe = post.likes.includes(user._id)

    if(!likedByMe){
        throw new BadRequestException("Can't remove a non existent like ")
    }

    const like = post.likes.findIndex((id)=>id.toString()==user._id.toString())
    if(like!=-1){
        post.likes.splice(like,1)
    }
    await post.save()

    return{
        data:{
            post
        } 
    }
}




async updatePost({user}:{user:HUser} , postId:Types.ObjectId|string , updateData:updatePostData  ){
    const post = await postModel.findById(postId)

    if(!post){
        throw new NotFoundException("Post not found")
    }

    const isOwner = user.id == post.createdBy.toString()

    if(!isOwner){
        throw new UnAuthorizedException()
    }

    const updatedPost = await postModel.findByIdAndUpdate(
    postId,
    { $set: updateData })

    return {
        data:updatedPost
    }
}


}


export const postServices = new PostServices()