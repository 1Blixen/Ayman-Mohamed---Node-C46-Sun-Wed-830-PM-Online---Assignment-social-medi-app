
import z from 'zod'

export interface IError extends Error {
    statusCode : number 
    validationError?: z.core.$ZodIssue []
}

abstract class AppErr extends Error implements IError{
    statusCode: number
    constructor(message: string , options:ErrorOptions , statusCode:number ,public validatioErrors?:z.core.$ZodIssue[]){
        super(message , options)
        this.statusCode = statusCode
    }
}

export class NotFoundException extends AppErr {
    constructor (message = "not found" , options : ErrorOptions ={} ,){
        super(message , options , 404)
    }
}


export class BadRequestException extends AppErr {
    constructor (message :string , options : ErrorOptions ={} ,){
        super(message , options , 400)
    }
}

export class ValidationExceptions extends AppErr {
    constructor ( validationErrors : z.core.$ZodIssue[] ){
        super("Validation error" , {} , 409 , validationErrors)
    }
}


export class UnAuthorizedException extends AppErr {
    constructor (){
        super("Unauthorized",{} , 401)
    }
}