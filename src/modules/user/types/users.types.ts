import { HydratedDocument } from "mongoose"

export enum genderEnum {
    male , 
    female
}

export enum providerEnum {
    system , 
    google
}


export enum roleEnum {
    user,
    admin
}

export interface IUser {
    name : string ,
    email : string ,
    password : string,
    age : number,
    isOnline : boolean,
    isActive : boolean,
    gender : genderEnum,
    phone : string,
    confirmedAt : Date,
    changedCredentialsAt : Date,
    provider : providerEnum ,
    role : roleEnum,
    profilePic : string,
    coverPics :  string[],
    bio : string
} 


export type HUser = HydratedDocument<IUser>