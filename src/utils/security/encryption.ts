import crypto from 'node:crypto'

const IV_length = 16



export const encrypt = (text : string)=>{
    const iv = crypto.randomBytes(IV_length)
    const cipher = crypto.createCipheriv("aes-256-cbc" ,process.env.ENCRYPTION_SECRET_KEY as string, iv)
    let encryptedData = cipher.update(text,'utf-8','hex')
    encryptedData += cipher.final('hex')
    return `${iv.toString('hex')}:${encryptedData}`
}


export const decrypt = (encryptedData : string)=>{


    const [iv,encryptedText] = encryptedData.split(':')
    const binaryLikeIv = Buffer.from(iv as string,'hex')
    const decipher = crypto.createDecipheriv("aes-256-cbc" ,process.env.ENCRYPTION_SECRET_KEY as string, binaryLikeIv)
    let decryptedData = decipher.update(encryptedText as string , 'hex' , 'utf-8')
    decryptedData += decipher.final('utf-8')
    return decryptedData
}