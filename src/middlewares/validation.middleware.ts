import type { NextFunction, Request , Response} from "express" 
import z from 'zod'
import { safeParse, safeParseAsync, ZodObject } from "zod"
import { ValidationExceptions } from "../utils/error.exceptions"


export type reqKeys = Partial <keyof Request>
export type schemaType = Partial <Record<reqKeys , ZodObject >>

export const validation = (schema : schemaType)=>{
    return async (req:Request , res : Response , next: NextFunction)=>{
        const keys = Object.keys(schema) as reqKeys[]

        const validationErrors : z.core.$ZodIssue[] = []

        for (const key of keys) {
              const validationRes = await schema[key]?.safeParseAsync(req[key]) 
            if(!validationRes?.success){
                
                validationErrors.push(validationRes?.error.issues as unknown as z.core.$ZodIssue )
            }
        }
        
        if(validationErrors.length){
            throw new ValidationExceptions(validationErrors)
        }
            
            return next()
    }
}




