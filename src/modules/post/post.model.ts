import {Schema ,Types , model} from "mongoose"
import {IPost, privacyEnum} from "./post.types"


export const postSchema = new Schema<IPost>({
    title:{
        type : String , 
        required:true
    },
    attachments:{
        type:[String]
    },
    content:{
        type:String,
        required:function(this){
            return this.attachments.length == 0
        }
    },
    likes:{
        type:[Types.ObjectId],
        ref:"User"
    } , 
    privacy:{
        type : Number,
        default: privacyEnum.public
    },
    createdBy:{
        type : Types.ObjectId,
        ref:"User",
        required:true
    }

},
{   timestamps : true ,
    strictQuery:true,
    strict : true,
    optimisticConcurrency:true,
    toJSON: {getters : true,
        virtuals:true
    },
    toObject: {
        getters:true,
        virtuals : true
    }})


    export const postModel = model("Post" , postSchema)