'use strict';

const restartGame = function() {
    text.style.display = "block";
    px = 10;
    py = 10;
    xv = 0;
    yv = 0;
    trail = []; // Array holding limbo-tiles
    filled = []; // Array holding filled tiles
    filled.push({ x: px + 1, y: py + 1}, { x: px + 1, y: py}, { x: px + 1, y: py - 1}, { x: px, y: py + 1}, { x: px, y: py - 1}, { x: px - 1, y: py + 1}, { x: px - 1, y: py}, { x: px - 1, y: py - 1},{ x: px, y: py});
  }

window.onload = function () {
    document.addEventListener("keydown", keyPush); // Listen for keyboard presses.
    setInterval(game, 100); // Run function game every 100 ms.
}

let text = document.querySelector("#gameStateID");
const canvas = document.querySelector("canvas"); // Select canvas
const ctx = canvas.getContext("2d"); // Select the context for the canvas
const btn = document.querySelector("#gameStateButton").addEventListener("click", restartGame); // Select restart button

canvas.width = window.innerWidth; 
canvas.height = window.innerHeight; 
const gs = 20;
let px = canvas.width/gs-1;
let py = canvas.height/gs-1;
let xv = 0;
let yv = 0;
let trail = []; // Array holding snake
let filled = []; // Array holding filled tiles
filled.push({ x: px + 1, y: py + 1}, { x: px + 1, y: py}, { x: px + 1, y: py - 1}, { x: px, y: py + 1}, { x: px, y: py - 1}, { x: px - 1, y: py + 1}, { x: px - 1, y: py}, { x: px - 1, y: py - 1});

function game() {
  px += xv; // Change snake x position by x-velocity
  py += yv; // Change snake y position by y-velocity
  if (px < 0) {
    restartGame();
  }
  if (px > canvas.width/gs-1) {
    restartGame();
  }
  if (py < 0) {
    restartGame();
  }
  if (py > canvas.height/gs-1) {
    restartGame();
  }

  // Background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  drawClaimedTiles();

  // Renders snake.
  ctx.fillStyle = "lime";
  for (var i = 0; i < trail.length; i++) {
    // Draws each piece of the snake.
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
        text.style.display = "none";
        break;
    // Down arrow
    case 38:
      if(yv == 1) {
        break;
      }
        xv = 0;
        yv = -1;
        text.style.display = "none";
        break;
    // Right arrow
    case 39:
      if(xv == -1) {
        break;
      }
        xv = 1;
        yv = 0;
        text.style.display = "none";
        break;
    // Up arrow
    case 40:
      if(yv == -1) {
        break;
      }
        xv = 0;
        yv = 1;
        text.style.display = "none";
        break;
    case 65: //a
      if(xv == 1) {
        break;
      }
        xv = -1;
        yv = 0;
        text.style.display = "none";
        break;
    case 87: //s
      if(yv == 1) {
        break;
      }
        xv = 0;
        yv = -1;
        text.style.display = "none";
        break;
    case 68: //d
      if(xv == -1) {
        break;
      }
        xv = 1;
        yv = 0;
        text.style.display = "none";
        break;
    case 83: //w
      if(yv == -1) {
        break;
      }
        xv = 0;
        yv = 1;
        text.style.display = "none";
        break;
  }
}