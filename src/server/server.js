'use strict';

const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const createBoard = require("./createBoard");

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);
const {initialize, getBoard, makeTurn} = createBoard(160);
//160 
//46

// Update board server side, 
// then send board to be rendered back to client.

io.on("connection", function (sock) {
    // Get current status and
    // send snake and starting area to new player
    // getBoard() instead of anon function?
    sock.emit("init", function() {
        let filled = [];
        filled.push({ x: px, y: py-1}, { x: px + 1, y: py}, { x: px + 1, y: py-1}, { x: px + 1, y: py - 2}, { x: px, y: py }, { x: px, y: py - 2}, { x: px - 1, y: py }, { x: px - 1, y: py-1}, { x: px - 1, y: py - 2});

        return filled;
    });

    // Receives move (new velocities)
    sock.on("move", function([xv, yv]) {
        // Updates game state

        // Emits new game state
        io.emit("update", function(){
            
        });
    });
});

server.on("error", function(err) {
    console.log(err);
});

server.listen(8080, function() {
    console.log("server is ready");
});
