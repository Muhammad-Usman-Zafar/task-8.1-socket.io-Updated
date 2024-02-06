
const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app);

const io = require("socket.io")(server)

const User = require('./models/UserModel')
const Chat = require("./models/ChatModel")

const routes = require("./routes/userRoute")
require('dotenv').config();

const port = process.env.PORT || 8000;

const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("DB connected Succesfully");
}).catch((err)=>{
    console.error(err);
});

app.use(routes)

var usp = io.of('/user-namespace');

usp.on('connection', async (socket)=>{
    console.log("User Connected");
    const user_id = socket.handshake.auth.token;
    const user = await User.findByIdAndUpdate({ _id: user_id }, { $set: { is_online: '1', last_seen: Date.now() } });

    socket.broadcast.emit('getOnlineUser', {userid: user_id})

    socket.on('disconnect', async ()=>{
        console.log("Disconnected");

    const user_id = socket.handshake.auth.token;
        await User.findByIdAndUpdate({ _id: user_id }, { $set: { is_online: '0', last_seen: Date.now() } });
    socket.broadcast.emit('getOfflineUser', {userid: user_id})
    })

    socket.emit('getUserLastSeen', { userid: user_id, last_seen: user.last_seen });


    socket.on("newChat", (data)=>{
        socket.broadcast.emit('loadnewchat', data)
    })

    socket.on('existschat', async(data)=>{
        const chats= await Chat.find({$or: [
            {sender_id: data.sender_id, reciever_id:data.reciever_id},
            {sender_id: data.reciever_id, reciever_id:data.sender_id}
        ]})
        socket.emit('loadchats', {chats: chats})
    })

    socket.on('newGroupChat', function(data){
        socket.broadcast.emit('loadNewGroupChat', data)
    })


socket.on('typing', function(data) {
    socket.broadcast.emit('userTyping', data);
});

socket.on('stopTyping', function(data) {
    socket.broadcast.emit('userStopTyping', data);
});


})

server.listen(port, ()=>{
    console.log(`Server is listening on ${port}`);
});