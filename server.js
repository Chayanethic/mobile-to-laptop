const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');

// Serve static files (HTML/JS)
app.use(express.static('public'));

// Add root route handler
app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to Mobile-to-Laptop Streamer</h1>
        <p>Use the following pages:</p>
        <ul>
            <li><a href="/streamer.html">Streamer (Phone)</a> - Start streaming from your phone and generate QR code.</li>
            <li><a href="/viewer.html?room=example">Viewer (Laptop)</a> - View the stream (replace 'example' with your room ID from QR).</li>
        </ul>
    `);
});

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
