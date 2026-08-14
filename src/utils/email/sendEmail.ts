import nodemailer from 'nodemailer'
import {generateHTML} from './template'
import { createOTP } from './otp'


export const sendEmail = async({to,subject,html}:{
    to : string,
    subject: string,
    html : string
})=>{
    const transporter = nodemailer.createTransport({
        host : "smtp@example.com" ,
        port : 578,
        service : "gmail",
        auth: {
            user : "aymangamer1583@gmail.com",
            pass: "aeiplphvbcwfocuz"
        }
    })

    const info = await transporter.sendMail({
        from : "hamada <hamada@gmail.com>" ,
        to ,
        subject  ,
        html
    })
    console.log({info});
}