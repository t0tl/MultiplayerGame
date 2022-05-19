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
    getUpdatedBoard, initializeBoard} = createBoard();
//140 
//36

// Update board server side, 
// then send board to be rendered back to client.
io.on("connection", function (sock) {
    // Get current status and
    // send snake and starting area to new player
    // getBoard() instead of anon function?
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

    setInterval(function() {
        io.emit("update", getUpdatedBoard());
    }, 200);

});

io.on("disconnect", function (sock) {
    // Search idList for sock.playerID
    // Clear player values and remove from list.
});

server.on("error", function(err) {
    console.log(err);
});

server.listen(8080, function() {
    console.log("server is ready");
    initializeBoard(99);
});