import {Schema , model} from 'mongoose'
import {genderEnum, IUser, providerEnum, roleEnum} from '../types/users.types'
import {hash} from "../../../utils/security/hash"
import { encrypt , decrypt } from '../../../utils/security/encryption'


const userSchema = new Schema<IUser>({
    name : {
        type : String ,
        required: true

    },
    email : {
        type : String , 
        required : true , 
        unique : true
    },
    password : {
        type : String , 
        required : function(this){
            return this.provider == providerEnum.system
        } , 
        
    }
    ,
    bio : {
        type : String,
    },
    age : {
        type : Number
    },
    gender : {
        type : Number , 
        enum : genderEnum
    },

    phone : {
        type : String,
        set : function( this :IUser, value:string){
            return encrypt(value)
        },
        get: function(value : string){
            return decrypt(value)
        }
    },
    changedCredentialsAt : {
        type : Date
    },
    isOnline :{
        type : Boolean
    },
    isActive : {
        type : Boolean
    },
    confirmedAt : {
        type : Date
    },
    provider : {
        type : Number , 
        enum : providerEnum
    },
    role : { 
        type : Number ,
        enum : roleEnum
    },
    profilePic : {
        type : String
    },
     coverPics : {
        type : [String]
     },


    
},{
    timestamps : true ,
    strictQuery:true,
    strict : true,
    optimisticConcurrency:true,
    toJSON: {getters : true,
        virtuals:true
    },
    toObject: {
        getters:true,
        virtuals : true
    }
})

// userSchema.pre("save", async function(this:IUser){
//     this.password = await hash(this.password)
// })

export const UserModel = model("User" , userSchema)