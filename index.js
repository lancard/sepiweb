const socketIoServer = require('socket.io').Server;
const express = require('express');
const net = require('net');
const iconvLite = require('iconv-lite');

// --------------------- express (just webserver) ---------------------
const app = express();
app.get('/', (req, res) => { res.redirect('/index.html'); });
app.use(express.static('app'));
app.listen(80, '0.0.0.0');

// --------------------- socket.io -------------------------
// global list
const io = new socketIoServer(8080, { cors: { origin: '*', methods: ["GET", "POST"] } });
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
            console.dir(socket);
            socket.emit('data', iconvLite.decode(data, 'cp949'));
        });
    });

    socket.on("data", (data) => {
        if(socket.sepi.socket.destroyed)
            return;

        socket.sepi.socket.write(iconvLite.encode(data, 'cp949'));
    });

    socket.on("disconnect", (reason) => {
        console.log(`socket closed(${reason}): ${socket.id}`);
        try {
            socket.sepi.socket.destroy();
        } catch(e) {
            console.dir(e);
        }
    });
});

