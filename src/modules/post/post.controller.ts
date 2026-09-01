import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { validation } from "../../middlewares/validation.middleware";
import * as PostValidation from "./post.validation";
import { postServices } from "./post.services";
import { successRes } from "../../utils/successRes";
import { HUser } from "../user/types/users.types";
import { object } from "zod";

export const router = Router()
export const routes = {
    base: "/posts",
    createPost:"/",
    getHomePage:"/",
    getPostsByUserId : "/userid/:id",
    deletePostById :"/delete/:id",
    getPost : "/get-post/:postId",
    likePost :"/:postId/like",
    unlikePost:"/:postId/unlike",
    updatePost:"/update/:postId"

}


router.post(
    routes.createPost,
    auth,
    validation(PostValidation.createPostValidation),
    async(req,res)=>{
        const userId = req.user._id

        const body = req.body as PostValidation.createPostData

        const {data} = await postServices.createPost({...body , userId} )


        return successRes({
            res , 
            data
        })
    }
)



router.get(
    routes.getHomePage,
    auth,
    async (req,res)=>{
        const user = req.user
        const data = await postServices.getHomePage({user})
        return successRes({
            res,
            data
        })
    }
 
)



router.get(
    routes.getPostsByUserId,
    auth,
    validation(PostValidation.getPostByUserIdValidation),
    async (req,res)=>{
        const user = req.user
        const id = req.params.id as string
        const {data} = await postServices.getPostByUserId({
            user,
            userId:id
        })
        return successRes({
            res, data
        })
    }
)


router.delete(routes.deletePostById ,
    auth,
    async(req,res)=>{
        const user = req.user
        const {id} = req.params
        await postServices.deletePost({user},id as string)
        return successRes({res })
        
    }
)



router.get(routes.getPost,
    auth,
    async (req,res)=>{
        const user = req.user
        const {postId} = req.params as {postId:string}
        const {data} = await postServices.getPost(postId as string,{user})
        return successRes({
            res,
            data,
            
        })
    }
)



router.post(routes.likePost,
    auth,
    async (req,res)=>{
        const user = req.user
        const {postId} = req.params as {postId:string}
        const {data} = await postServices.likePost({user},postId)
        return successRes({
            res,
            data
        })
    }
)


router.delete(routes.unlikePost,
    auth,
    async(req,res)=>{
        const user = req.user
        const {postId} = req.params as {postId:string}
        const {data} = await postServices.unLike({user},postId)
        return successRes({
            res,
            data
        })
    }
)


router.patch(routes.updatePost ,
        validation(PostValidation.updatePostValidation),
        auth,
        async (req,res)=>{
            const user = req.user
            const postId = req.params.postId
            const updateData = req.body
            const {data} = await postServices.updatePost({user} , postId as string , updateData)
            return successRes({
                res , 
                data : data as object
            })
        }
)




export default router