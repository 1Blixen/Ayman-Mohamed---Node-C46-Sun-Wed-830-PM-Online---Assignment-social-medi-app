
import {Server as httpServer} from "http"
import { Server } from "socket.io"
import { decodeToken } from "../../middlewares/auth.middleware"
import { Socket } from "socket.io"
import { connectedSocketsKey } from "../../utils/redis/redis.services"
import { redisClient } from "../../db/redis.connection"



export const initializeIo = (httpServer: httpServer)=>{
const io = new Server(httpServer,{
        cors:{
            origin:"*"
        }
    })

     io.use(async (Socket,next)=>{
        try {
            const token = Socket.handshake.auth.token
            // const token = Socket.handshake.headers.authorization

            const {user} = await decodeToken({authorization:token})

            Socket.user = user 

            next()
        } catch (error) {
          console.log(error)  
          Socket.emit("error")
          next(error as Error)
        }

    })

    const connectedSockets: Map<string,string[]> = new Map()

    io.on("connect",(socket)=>{
        registerNewUser(socket)
       
        console.log("new connection detected =>",socket.id)

        socket.on("disconnect",()=>{
            revokeUser(socket)
            console.log("new disconnection detected =>" , socket.id)
        })

        
    })

    const registerNewUser = async (socket:Socket)=>{
           let userSockets:string|null|string[] = await redisClient.get(connectedSocketsKey(socket.user.id))
        if(userSockets){
            userSockets= JSON.parse(userSockets)
            await redisClient.set(connectedSocketsKey(socket.user.id) , JSON.stringify([socket.id,...(userSockets as [])]))
    } else {
        await redisClient.set(connectedSocketsKey(socket.user.id) , JSON.stringify([socket.id]))
    }
}


    const revokeUser = async (socket:Socket)=>{
        let userSockets:string|null|string[] = await redisClient.get(connectedSocketsKey(socket.user.id)) 
        let newUserSockets = JSON.parse(userSockets as string) as string[]
        newUserSockets = newUserSockets.filter((ele)=>{
                return ele != socket.id

        })

        if(newUserSockets.length = 0){
            await redisClient.del(connectedSocketsKey(socket.user.id))
        }else{
            await redisClient.set(connectedSocketsKey(socket.user.id),JSON.stringify(newUserSockets))
        }
        }
    }

