const { Server } = require('socket.io');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 9546;
const URL = process.env.URL;
const io = new Server(PORT, {
    cors: {
        origin: URL,
    }
})

let users = [];

const addUser = (userData, socketId) => {
    !users.some(user => user.sub == userData.sub) && users.push({ ...userData, socketId })
}

const getUser = (recieverId) => {
    return users.find(user => user.sub === recieverId);
}

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('addUsers', userData => {
        addUser(userData, socket.id);
        io.emit('getUsers', users);
    })

    socket.on('sendMessage', data => {
        const user = getUser(data.recieverId);
        if (!user) return;
        console.log(user);
        io.to(user.socketId).emit('getMessage', data);
    })
})

module.exports = { io }