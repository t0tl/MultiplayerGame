'use strict';

const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const createBoard = require("./createBoard");
const { uuid } = require('uuidv4');

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);
const {newPlayer, updateVelocity, 
    getUpdatedBoard, initializeBoard, disconnected} = createBoard();
//140 
//36

// Update board server side, 
// then send board to be rendered back to client.
io.on("connection", function (sock) {

    // Gets current status and
    // sends snake and starting area to new player
    sock.emit("init", (function() {
        let randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        sock.color = randomColor;
        sock.playerID = uuid();
        return newPlayer(sock);
    })());

    // Receives move (new velocities)
    sock.on("move", function([xv1, yv1]) {
        // Updates velocities
        updateVelocity(xv1, yv1, sock.arrElem);
    });
    
    sock.on("disconnect", function (reason) {
        disconnected(sock.arrElem);
        // Search idList for sock.playerID
        // Clear player values and remove from list.
    });
    
});

setInterval(function() {
    io.emit("update", getUpdatedBoard());
}, 150);

server.on("error", function(err) {
    console.log(err);
});

server.listen(80, function() {
    console.log("server is ready");
    initializeBoard(99);
});
