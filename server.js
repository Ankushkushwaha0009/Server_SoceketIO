const express = require("express")  ; 
const http = require("http") ; 
const socketIo = require("socket.io") ; 
const cors = require("cors") ; 
const app = express() ; 
const server  = http.createServer(app) ; 

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],       
}));

const io  = socketIo(server , {
    cors : {
        origin : "http://localhost:3000" , 
        methods : ["GET" , "POST"] , 
    }
}) ; 


app.use(express.static("public"))  ; 

io.on("connection" , (socket)  =>  {
    console.log("A user is connected .. ") ; 
    socket.on("chat-message" , (msg)  =>  {
        console.log("Message from client : " , msg) ; 
        // it will send the message to all the client 
        // including the sender also 
        io.emit("chat-message", msg) ; 
    })
    socket.on("disconnect"  , ()  => {
        console.log('A user is disconnected .. ') ; 
    })
})

server.listen(5000 , ()  =>  {
    console.log("Server is running on 5000") ; 
})