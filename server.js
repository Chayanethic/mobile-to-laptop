const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');

// Serve static files (HTML/JS)
app.use(express.static('public'));

// PeerJS server for WebRTC signaling
const peerServer = ExpressPeerServer(server, { debug: true });
app.use('/peerjs', peerServer);

// Socket.io for custom signaling (session sharing)
io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));
