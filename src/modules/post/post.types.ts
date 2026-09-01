import { HydratedDocument, ObjectId, Types } from "mongoose"


export enum privacyEnum{
    public ,
    friends,
    private
}


export interface IPost{
    title:string ,
    content :string,
    attachments:Array<string>,
    likes : Array<Types.ObjectId>,
    privacy: privacyEnum,
    createdBy: Types.ObjectId 
} 

export type HPost = HydratedDocument<IPost>