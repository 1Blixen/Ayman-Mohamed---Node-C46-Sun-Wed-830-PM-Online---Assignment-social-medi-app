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



export const updatePostValidation = {
    body:z.strictObject({
        content:z.string().optional(),
        privacy : z.union([
            z.literal(0), // public
            z.literal(1), // friends
            z.literal(2) //private
        ]).optional() 
    }).refine((data)=>data.content||data.privacy , {
        message:"content is required if there is no privacy",
        path:['content']
    })
}

export type updatePostData = z.infer<typeof updatePostValidation.body>
