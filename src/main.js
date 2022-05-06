"use strict";
var x = document.querySelector("#gameStateID");
const restartGame = function() {
    x.style.display = "block";
    px = 10;
    py = 10;
    gs = 20;
    tc = 20;
    xv = 0;
    yv = 0;
    trail = []; // Array holding limbo-tiles
    filled = []; // Array holding filled tiles
    filled.push({ x: px + 1, y: py + 1}, { x: px + 1, y: py}, { x: px + 1, y: py - 1}, { x: px, y: py + 1}, { x: px, y: py - 1}, { x: px - 1, y: py + 1}, { x: px - 1, y: py}, { x: px - 1, y: py - 1},{ x: px, y: py});
  }

window.onload = function () {
    canvas;
    ctx;
    document.addEventListener("keydown", keyPush); // Listen for keyboard presses.
    setInterval(game, 100); // Run function game every 100 ms.
  };

let px = 10;
let py = 10;
let gs = 20;
let tc = 20;
let xv = 0;
let yv = 0;
let trail = []; // Array holding objects
let filled = []; // Array holding filled tiles
filled.push({ x: px + 1, y: py + 1}, { x: px + 1, y: py}, { x: px + 1, y: py - 1}, { x: px, y: py + 1}, { x: px, y: py - 1}, { x: px - 1, y: py + 1}, { x: px - 1, y: py}, { x: px - 1, y: py - 1});

const canvas = document.querySelector("canvas"); // Select canvas
const ctx = canvas.getContext("2d"); // Select the context for the canvas
const btn = document.querySelector("#gameStateButton").addEventListener("click", restartGame); // Select restart button

function game() {
  px += xv; // Change snake x position by x velocity
  py += yv; // Change snake y position by y velocity
  if (px < 0) {
    //px = tc-1;
    restartGame();
  }
  if (px > tc - 1) {
    //px = 0;
    restartGame();
  }
  if (py < 0) {
    //py = tc-1;
    restartGame();
  }
  if (py > tc - 1) {
    //py = 0;
    restartGame();
  }

  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  drawClaimedTiles();
  
  // Render snake.
  ctx.fillStyle = "lime";
  for (var i = 0; i < trail.length; i++) {
    // Draw each piece of the snake.
    ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
    if (trail[i].x == px && trail[i].y == py) {
        restartGame();
    }
  }

  let found = false;
  //Optimera genom att den t.ex. bara kollar kanter.
  for (const element of filled) {
    if(px == element.x && py == element.y){
      found = true;
    }
  }

  if(found){
    getInsideTile();
  }else{
    trail.push({ x: px, y: py });
  }
}

function getInsideTile(){
  let node = trail[trail.length-1];
}

function drawClaimedTiles(){
  ctx.fillStyle = "blue";
  for (var i = 0; i < filled.length; i++){
    ctx.fillRect(filled[i].x * gs, filled[i].y * gs, gs - 2, gs - 2);
  }
}

function keyPush(event) {
  switch (event.keyCode) {
    // Left arrow
    case 37:
      if(xv == 1) {
        break;
      }
        xv = -1;
        yv = 0;
        x.style.display = "none";
        break;
    // Down arrow
    case 38:
      if(yv == 1) {
        break;
      }
        xv = 0;
        yv = -1;
        x.style.display = "none";
        break;
    // Right arrow
    case 39:
      if(xv == -1) {
        break;
      }
        xv = 1;
        yv = 0;
        x.style.display = "none";
        break;
    // Up arrow
    case 40:
      if(yv == -1) {
        break;
      }
        xv = 0;
        yv = 1;
        x.style.display = "none";
        break;
    case 65: //a
      if(xv == 1) {
        break;
      }
        xv = -1;
        yv = 0;
        x.style.display = "none";
        break;
    case 87: //s
      if(yv == 1) {
        break;
      }
        xv = 0;
        yv = -1;
        x.style.display = "none";
        break;
    case 68: //d
      if(xv == -1) {
        break;
      }
        xv = 1;
        yv = 0;
        x.style.display = "none";
        break;
    case 83: //w
      if(yv == -1) {
        break;
      }
        xv = 0;
        yv = 1;
        x.style.display = "none";
        break;
  }
}