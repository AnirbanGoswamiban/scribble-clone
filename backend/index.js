
const express=require('express')

const app=express();

const http=require('http')
const server=http.createServer(app)

const {Server}=require('socket.io')
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
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
  
})





app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/index.html")
    
})

const port=9000
server.listen(9000,()=>{
    console.log(`Server is listening at port ${port}`);
})