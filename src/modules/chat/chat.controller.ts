import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { chatServices } from "./chat.services";
import { successRes } from "../../utils/successRes";


const router = Router()

export const routes = {
    base:"/chats",
    getChat:"/:id",
    createGroup:"/create-group"
}



router.get(routes.getChat , 
    auth,
    async (req ,res)=>{
        const {user} = req
        const id = req.params.id
        const data = await chatServices.getChat({user , id: id as string})
        return successRes({
            res ,
            data
        })
    }
)




router.post(routes.createGroup ,
    auth,
    async(req,res)=>{
        const {group , participants} = req.body
        const user = req.user
        const{data} = await chatServices.createGroup({group,participants,user})

        return successRes({
            res ,
            data
        })
    }
)







export default router