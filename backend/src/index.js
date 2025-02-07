import express from 'express'; 
import authRoutes from './routes/auth.route.js'
import dotenv from 'dotenv'
import messageRoute from './routes/message.route.js'; 
import { connectToDB } from './lib/db.js';
import cookieparser from 'cookie-parser'
import cors from 'cors'; 
import {app,server} from './lib/socket.js'
import path from 'path'



dotenv.config(); 

const PORT = process.env.PORT
const __dirname = path.resolve(); 


app.use(express.json()); 
app.use(cookieparser()); 
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);




app.use('/api/auth',authRoutes); 
app.use('/api/messages',messageRoute); 


app.get('/',(req,res)=>{
    res.send("hello world") ; 
})

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist"))); 

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html")); 
})

}

server.listen(8000,()=>{
    console.log("server is running on port 8000"),
    connectToDB(); 
});