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
    trail = []; // Array holding objects
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

  // Render snake.
  ctx.fillStyle = "lime";
  for (var i = 0; i < trail.length; i++) {
    // Draw each piece of the snake.
    ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
    if (trail[i].x == px && trail[i].y == py) {
        //Insert flood fill algo.
      restartGame();
    }
  }
  // Adds a tile object to the trail array.
  trail.push({ x: px, y: py });
}

function keyPush(event) {
  switch (event.keyCode) {
    // Left arrow
    case 37:
        xv = -1;
        yv = 0;
        x.style.display = "none";
        break;
    // Down arrow
    case 38:
        xv = 0;
        yv = -1;
        x.style.display = "none";
        break;
    // Right arrow
    case 39:
        xv = 1;
        yv = 0;
        x.style.display = "none";
        break;
    // Up arrow
    case 40:
        xv = 0;
        yv = 1;
        x.style.display = "none";
        break;
    case 65: //a
        xv = -1;
        yv = 0;
        x.style.display = "none";
        break;
    case 87: //s
        xv = 0;
        yv = -1;
        x.style.display = "none";
        break;
    case 68: //d
        xv = 1;
        yv = 0;
        x.style.display = "none";
        break;
    case 83: //w
        xv = 0;
        yv = 1;
        x.style.display = "none";
        break;
  }
}