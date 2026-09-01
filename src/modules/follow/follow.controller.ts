import {Router} from "express"
import { auth } from "../../middlewares/auth.middleware"
import { followServices, FollowServices } from "./follow.services"
import { successRes } from "../../utils/successRes"
const router = Router()

export const routes = {
    base:"/follow"
}


router.post("/:id" , 
    auth,
    async (req,res)=>{
        const user = req.user
        const targetId = req.params.id
        const {data} = await followServices.followUser({user} , targetId as string)
        return successRes({
            res, 
            data
        })
    }
)



router.delete("/:id",
    auth,
    async(req,res)=>{
        const user = req.user
        const targetId = req.params.id
        const {data} = await followServices.unFollow({user} , targetId as string)
        return successRes({
            res ,
            data
        })
    }
)











export default router