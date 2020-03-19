const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const {addUser, removeUser, getUser, getUsersInRoom} = require("./users"); 

const port = process.env.PORT || 5000;

const router = require("./router")

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) =>  {
  
    socket.on("join", ({name,room}, callback)=> {
        console.log(name, room);

        const {error , user} = addUser({id : socket.id, name, room});
        console.log(user)

        if(error) {
          return callback(error);
        }

        //if(user) {
          
          socket.emit("message", {user : "admin", text : `${user.name}, welcome to the room ${user.room}`});
          socket.broadcast.to(user.room).emit("message", {user : "admin", text : `${user.name}, has joined!`});

          socket.join(user.room);

          io.to(user.room).emit("roomData", {room : user.room, users : getUsersInRoom(user.room)});

          callback();
        //}

    })

    socket.on('sendMessage', (message, callback) => {

      const user = getUser(socket.id);
      console.log("getuser",user)
      io.to(user.room).emit("message", {user : user.name, text : message});

      callback();
    });  

    socket.on('disconnect', () => {

      const user = removeUser(socket.id);
      if(user) {
        io.to(user.room).emit("message", {user: "admin", text: `${user.name} has left`});
        io.to(user.room).emit("roomData", {room : user.room, users : getUsersInRoom(user.room)});
      } 
    });
  });

app.use(router);

server.listen(port, ()=> {
    console.log(`server has started on port ${port}`)
});