'use strict';

const renderBoard = function(canvas, sock){
  let xv = 0;
  let yv = 0;
  let ctx = canvas.getContext("2d");
  const gs = canvas.height*0.02;

  const drawBackground = function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const drawBoard = function(arr) {
    let board = arr[0];
    console.log(board);
    let colorList = arr[1];
    console.log(colorList);
    for (let i = 0; i<board.length; i++){
      for (let j = 0; j<board[0].length; j++) {
        //Insert switch to determine color to draw
        for (let k = 1; k<colorList.length; k++) {
          if (board[i][j] == k) {
            ctx.fillStyle = colorList[k];
            ctx.fillRect(i*gs, j*gs, gs, gs);
          }
          else if (board[i][j] == -k) {
            ctx.fillStyle = colorList[k];
            ctx.fillRect(i*gs, j*gs, gs-2, gs-2);
          }
        }
      }
    }
  }

  const keyPush = function(event) {

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
    document.sock.emit("move", [xv,yv])
  }

  drawBackground();
  return {drawBoard, keyPush};
}

function nodesMatch(node1, node2, xinc, yinc) {
  if (node1.x == node2.x+xinc && node1.y == node2.y+yinc) {
    return true;
  }
  return false;
}

(function() {
  const canvas = document.querySelector("canvas"); // Select canvas
  canvas.width = window.innerWidth; 
  canvas.height = window.innerHeight; 
  let board = [[0]];
  const sock = io();
  const {drawBoard, keyPush} = renderBoard(canvas, board, sock);
  sock.on("init", function(x) {
    board = x;
    start();
  });
  
  const start = function() {
    document.addEventListener("keydown", keyPush); // Listen for keyboard presses.
    document.sock = sock;
    console.log("hello");
    sock.on("update", drawBoard);
  }
})();