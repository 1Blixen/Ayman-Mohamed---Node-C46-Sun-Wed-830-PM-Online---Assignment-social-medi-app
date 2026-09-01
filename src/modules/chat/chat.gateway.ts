import { Socket } from "socket.io";
import { chatEvents } from "./chat.events";






class ChatGateWay{
    register(socket:Socket){
        chatEvents.sendMessage(socket)
    }
}




export const chatGateWay = new ChatGateWay()