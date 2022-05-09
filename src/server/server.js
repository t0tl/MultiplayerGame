'use strict';

const express = require("express");
const http = require("http");
const socketio = require("socket.io")

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);
io.on("connection", function (sock) {
    sock.emit("message", "You are connected");
    sock.on("move", function() {
        io.emit("message", "someone moved");
    });
});

server.on("error", function(err) {
    console.log(err);
});

server.listen(8080, function() {
    console.log("server is ready");
});

