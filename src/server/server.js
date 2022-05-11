'use strict';

const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const createBoard = require("./createBoard");

const app = express();

app.use(express.static(`${__dirname}/../client`));

const server = http.createServer(app);
const io = socketio(server);
const {clear, getBoard, makeTurn} = createBoard(20);

/*
direction = function(event) {
    switch (event.keyCode) {
        // Left arrow
        case 37:
          if(xv == 1) {
            break;
          }
            xv = -1;
            yv = 0;
            break;
        // Down arrow
        case 38:
          if(yv == 1) {
            break;
          }
            xv = 0;
            yv = -1;
            break;
        // Right arrow
        case 39:
          if(xv == -1) {
            break;
          }
            xv = 1;
            yv = 0;
            break;
        // Up arrow
        case 40:
          if(yv == -1) {
            break;
          }
            xv = 0;
            yv = 1;
            break;
        case 65: //a
          if(xv == 1) {
            break;
          }
            xv = -1;
            yv = 0;
            break;
        case 87: //s
          if(yv == 1) {
            break;
          }
            xv = 0;
            yv = -1;
            break;
        case 68: //d
          if(xv == -1) {
            break;
          }
            xv = 1;
            yv = 0;
            break;
        case 83: //w
          if(yv == -1) {
            break;
          }
            xv = 0;
            yv = 1;
            break;
    }
}
*/
io.on("connection", function (sock) {
    // Get current status and
    // send snake and starting area to new player
    sock.emit("init", function() {
        
    });

    // Receives move 
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
