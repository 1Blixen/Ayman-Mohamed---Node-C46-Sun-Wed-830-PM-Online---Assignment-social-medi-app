export const confirmEmailKey = (userId:string)=>`users:${userId}:confirmEmailOTP`

export const jwtIdKey = (userId : string , jwtId : string )=> ` users:${userId} :${jwtId}`