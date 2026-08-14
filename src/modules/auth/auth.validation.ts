import * as z from 'zod'
import { schemaType } from '../../middlewares/validation.middleware'
import { genderEnum } from '../user/types/users.types'

export const loginSchema = {
    body : z.object({
        email : z.email() ,
        password : z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$/)
    }) 
}


export type loginData = z.infer<typeof loginSchema.body>



export const signUpSchema = {
    body : z.strictObject({
        name : z.string(),
        email : z.email() , 
        password : z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$/),
        age : z.number().optional(),
        gender : z.union([
            z.literal(genderEnum.male),
            z.literal(genderEnum.female),
        ]) ,
        bio : z.string().min(10) ,
        phone : z.string()

    })
}


export type signUpData = z.infer<typeof signUpSchema.body>


export const confirmEmailSchema = {
    body :z.strictObject({
        email:z.email(),
        otp : z.string()
    })
}
export type confirmEmailData = z.infer<typeof confirmEmailSchema.body>
export const resendConfirmEmailSchema = {
    body :z.strictObject({
        email:z.email()
    })
}

export type resendConfirmEmailData = z.infer<typeof resendConfirmEmailSchema.body>

