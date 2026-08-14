import mongoose from 'mongoose';
import { log } from 'node:console';



export const DBConnection = async()=>{
    mongoose.connect(process.env.LOCAL_DB_URI as string)    
    .then(()=>{         
        console.log("DB connected successfully")
    })
    .catch(console.log)
}