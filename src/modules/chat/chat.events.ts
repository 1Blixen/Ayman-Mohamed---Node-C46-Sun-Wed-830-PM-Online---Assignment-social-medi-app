import { Socket } from "socket.io";
import { chatSocketServices } from "./chat.socket.services";




class ChatEvents { 

    async sendMessage(socket:Socket){
        socket.on("sendMessage" , (data)=>{
            return chatSocketServices.sendMessage({data , socket})
        })
    }
}

export const chatEvents = new ChatEvents()