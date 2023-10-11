
const express=require('express')

const dotenv=require("dotenv")
dotenv.config()

const app=express();

const http=require('http')
const server=http.createServer(app)

const {Server}=require('socket.io')
const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173/canvas","http://localhost:5173/client"],
        methods:["GET","POST"]
    }
})

const cors=require('cors')
app.use(cors())

io.on("connection",(socket)=>{
    console.log(`user joined ...${socket.id}`);
   socket.on("draw",(data)=>{
    console.log(data);
    io.emit("broadcast-points", data);
   
   })
   socket.on("mouseup",()=>{
    console.log("stopped");
    io.emit("stop-points", "data");
   })
   socket.on("mousedown",()=>{
    console.log("start");
    io.emit("start-points", "data");
   })
   socket.on("clear-canvas",()=>{
    console.log("clear");
    io.emit("clear-canvas", "clear");
   })

  
})





app.get('/',(req,res)=>{
    res.send("all fit")
    
})

const port = process.env.PORT || 9000
server.listen(9000,()=>{
    console.log(`Server is listening at port ${port}`);
})