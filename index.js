const net = require('net');
const http = require('http');

const express = require('express');
const iconvLite = require('iconv-lite');
const socketIoServer = require('socket.io').Server;

// --------------------- express (just webserver) ---------------------
const app = express();
app.get('/', (req, res) => {
    res.sendFile('/index.html');
});

// --------------------- http server ---------------------
const server = http.createServer(app);

// --------------------- socket.io -------------------------
const io = new socketIoServer(server, { cors: { origin: '*', methods: ["GET", "POST"] } });
io.on("connection", (socket) => {
    console.log("new connection: " + socket.id);
    // console.dir(io.sockets.sockets);
    socket.on('error', (err) => {
        socket.destroy();
        console.log(`socket error: ${err}`);
    });


    socket.on("requestConnection", (arg) => {
        socket.sepi = arg;
        socket.sepi.socket = net.connect(arg);
        socket.sepi.socket.on('data', (data) => {
            socket.emit('data', iconvLite.decode(data, 'cp949'));
        });
    });

    socket.on("data", (data) => {
        try {
            if (socket.sepi.socket.destroyed)
                return;

            socket.sepi.socket.write(iconvLite.encode(data, 'cp949'));
        }
        catch (e) {
            console.dir(e);
        }
    });

    socket.on("disconnect", (reason) => {
        console.log(`socket closed(${reason}): ${socket.id}`);
        try {
            socket.sepi.socket.destroy();
        } catch (e) {
            console.dir(e);
        }
    });
});

// --------------------- http server start ---------------------
server.listen(80, '0.0.0.0');
