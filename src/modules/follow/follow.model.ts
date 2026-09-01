import {Schema , Types, model} from "mongoose"

export interface IFollow{
    follower: Types.ObjectId,
    following:Types.ObjectId
}



const followSchema = new Schema <IFollow>({
    follower : {
        type :Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    following:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})


export const followModel = model("Follow",followSchema)