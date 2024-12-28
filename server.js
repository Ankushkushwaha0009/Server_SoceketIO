const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {
  console.log("A user is connected with socket id : ", socket.id);

  socket.on("join", (username) => {
    users[socket.id] = username;
    // console.log(users) ; 
    console.log(`${username}  has joined the chat!  `);
    socket.broadcast.emit("user-joined", `${username}  has joined the chat!`);
  });

  socket.on("chat-message", (msg) => {
    console.log("Message from client : ", msg);
    // it will send the message to all the client
    io.emit("chat-message", msg); // broadcast to all users  ...
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    console.log(`${username}  has left the chat  .. `);
    delete users[socket.id];
    socket.broadcast.emit("user-left", `${username} has left the chat`);
  });
});

server.listen(5000, () => {
  console.log("Server is running on 5000");
});
