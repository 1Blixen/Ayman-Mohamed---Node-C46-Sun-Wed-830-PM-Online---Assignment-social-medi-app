import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import * as userValidation from "./user.validation";
import { auth } from "../../middlewares/auth.middleware";
import { userServices } from "./user.services";
import { successRes } from "../../utils/successRes";
const router = Router() 

export const routes = {
    base : "/users",
    sendFriendRequest : "/send-friend-request",
    friendRequestReply : "/friend-request-reply/:id"
}


router.post(routes.sendFriendRequest , 
    validation(userValidation.sendFriendRequestSchema),
    auth,
    async (req,res)=>{
        const {to} = req.body as userValidation.sendFriendRequestData
        const {id: from} = req.user
        
        await userServices.sendFriendRequest({to,from})
        return successRes({res})
        }
    )


    router.patch(
        routes.friendRequestReply,
    validation(userValidation.friendRequestReplySchema),
auth,
async (req,res)=>{
    const {id} = req.params as {id : string}
    const {status}=req.body
    const{_id : userId} = req.user
    await userServices.friendRequestReply({id , status , userId: userId as unknown as string})
    return successRes({res})
})







export default router