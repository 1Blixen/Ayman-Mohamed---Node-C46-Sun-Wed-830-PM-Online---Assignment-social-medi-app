import { Router } from "express";
import {confirmEmailData,confirmEmailSchema,loginData,loginSchema,resendConfirmEmailData,signUpData,resendConfirmEmailSchema,signUpSchema} from "./auth.validation";
import {validation} from "../../middlewares/validation.middleware"
import { authServices } from "./auth.services";
import { genderEnum } from "../user/types/users.types";
import { successRes } from "../../utils/successRes";
import { auth } from "../../middlewares/auth.middleware";


const router = Router()



export const routes = {
    base : "/auth",
    signup : "/signup",
    confirmEmail: "/confirm-email",
    login : "/login",
    resendOTP : "/resend-otp",
    profile : "/profile"

}




router.post(routes.signup,validation(signUpSchema) , async (req,res)=>{
    const signupData = req.body as signUpData
    const {data} = await authServices.signUp(signupData)
    return successRes ({res , data , statusCode:201 })
})


router.patch(routes.confirmEmail , validation(confirmEmailSchema) , async(req, res)=>{
    const body= req.body as confirmEmailData
    const {} = await authServices.confirmEmail(body)
    return successRes({res})
})

router.post(routes.login ,validation(loginSchema) ,async (req,res)=>{
    const body = req.body as loginData

    const {data} = await authServices.login(body)
    
    return successRes({
        res,
        data
    })

})

router.patch(routes.resendOTP ,validation(resendConfirmEmailSchema) , async(req,res)=>{
 const body  = req.body as resendConfirmEmailData

 await authServices.resendOTP(body)
 
return successRes({
    res
})
}  )


router.get(routes.profile , auth , (req ,res)=>{
    const user = req.user
    successRes({
        res , 
        data:{
            user
        }
    })
})



export default router
