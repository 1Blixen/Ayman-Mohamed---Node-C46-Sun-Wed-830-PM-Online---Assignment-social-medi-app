import z from "zod"
import { isValidObjectId } from "mongoose"



export const createPostValidation = {
    body: z.strictObject({
        title : z.string() ,
        content : z.string(),
        privacy : z.union([
            z.literal(0), // public
            z.literal(1), // friends
            z.literal(2) //private
        ]) 

    })
}

export type createPostData = z.infer<typeof createPostValidation.body>


export const getPostByUserIdValidation={
    params : z.strictObject({
        id :z.string().refine((value)=>{
            return isValidObjectId(value)
        })
})
}

export type getPostsByUserIdData = z.infer<typeof getPostByUserIdValidation>