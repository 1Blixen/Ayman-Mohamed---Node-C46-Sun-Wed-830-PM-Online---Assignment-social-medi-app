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
    friendRequestReply : "/friend-request-reply/:id",
    listFriendRequest : "/list-friend-requests",
    cancelFriendRequest: "/cancel-friend-request/:id",
    listFriends : "/list-friends",
    getUser:"/:targetId"
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


router.get(
    routes.listFriendRequest 
    , auth , 
    async(req,res)=>{
        const userId = req.user._id

        const {isTo = true} = req.query
        const {data} = await userServices.listFriendRequest({userId , isTo:JSON.parse(isTo as string)})

        return successRes({
            res , 
            data
        })
    }
)



router.patch(
    routes.cancelFriendRequest,
    validation(userValidation.cancelFriendRequestSchema),
    auth,
    async (req,res)=>{
        const {id} = req.params as userValidation.cancelFriendRequestData
        const userId = req.user.id

        await userServices.cancelFriendRequest({userId , id })

        return successRes({
            res
        })
    }
)


router.get(
    routes.listFriends,
    auth,
    async(req,res)=>{
        const user = req.user
        const userId = req.user._id
        const {data} = await userServices.listFriends({userId})
        return successRes({res , data})

    }
)


router.get(routes.getUser , 
    auth,
    async (req,res)=>{
        const targetId = req.params.targetId
        const user= req.user
        const {data} = await userServices.getUser({user} , targetId as string)

        return successRes({
            res ,
            data
        })
    }
)



export default router