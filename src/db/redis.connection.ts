import {createClient} from "redis"
import chalk from "chalk"
import { log } from "node:console"

export const redisClient = createClient({
    url : "redis://127.0.0.1:6379",
    database : 0
})

    redisClient.on("error", (err)=>{
        console.log(chalk.red("redis connection failed => " ) , err)
    })

    
    redisClient.on("connect" , ()=>{
        console.log(chalk.green("Redis connected successfully"))
    })
    
