const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");



const app=express();
const port = process.env.PORT||4500;

const users=[{}];

app.use(cors());


app.get("/",(req,res)=>{
    res.send("HELLO IT IS WORKING !!! ");
})

const server = http.createServer(app);
const io = socketIO(server);



io.on("connection",(socket)=>{
    console.log("new connection");
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} is joined`);
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat , ${users[socket.id]}`});

    })
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
    })
    socket.on('disconnection',()=>{
        socket.broadcast.emit('leave',{user:"Admin",message:"User has left"});
        console.log("User left");
    })
    
    
});

server.listen(port,()=>{
    console.log(`server is running on ${port}`);
})