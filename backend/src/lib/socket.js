import {Server} from 'socket.io'; 
import http from 'http'; 
import express from 'express'; 


const app = express(); 
const server = http.createServer(app); 

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
}); 

export function getReceiverSocketId(userId){
    console.log("reciever socket id : ", userId); 
    return userSocketMap[userId]; 
    
}

const userSocketMap = {};

io.on('connection',(socket)=>{
    console.log("user connected : ",socket.id); 

const userId = socket.handshake.query.userId; 

if(userId) userSocketMap[userId] = socket.id; 
io.emit("getOnlineUser",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("a user disconnected"); 
        delete userSocketMap[userId]; 
    })
})

export {io,app,server}; 
