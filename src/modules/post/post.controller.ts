import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { validation } from "../../middlewares/validation.middleware";
import * as PostValidation from "./post.validation";
import { postServices } from "./post.services";
import { successRes } from "../../utils/successRes";

export const router = Router()
export const routes = {
    base: "/posts",
    createPost:"/",
    getHomePage:"/",
    getPostsByUserId : "/userid/:id"
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








export default router