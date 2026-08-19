import { Types , Schema , model } from "mongoose"
import { FriendRequestEnum, IFriendRequest } from "../types/friendRequest.types"
import { fr } from "zod/locales"



const friendRequestSchema = new Schema<IFriendRequest>({
    from : {
        type : Types.ObjectId , 
        required : true,
        ref: "User"
    },
    to : {
        type : Types.ObjectId , 
        required : true,
        ref: "User"
    } ,
    status : {
        type : Number , 
        // enum:Object.values(FriendRequestEnum),
        default : FriendRequestEnum.pending
    }

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

export const friendRequestModel = model("FriendRequest" , friendRequestSchema)