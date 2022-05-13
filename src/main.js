'use strict';

const restartGame = function() {
    text.style.display = "block";
    px = 10;
    py = 10;
    xv = 0;
    yv = 0;
    enclosed = [];
    trail = []; // Array holding limbo-tiles
    filled = []; // Array holding filled tiles
    filled.push({ x: px + 1, y: py + 1}, { x: px + 1, y: py}, { x: px + 1, y: py - 1}, { x: px, y: py + 1}, { x: px, y: py - 1}, { x: px - 1, y: py + 1}, { x: px - 1, y: py}, { x: px - 1, y: py - 1});
    const edges = [...filled];
    filled.push({ x: px, y: py})
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
let px = 10;
let py = 10;
let xv = 0;
let yv = 0;
let enclosed = [];
let trail = []; // Array holding snake
let filled = []; // Array holding filled tiles
filled.push({ x: px + 1, y: py + 1}, { x: px + 1, y: py}, { x: px + 1, y: py - 1}, { x: px, y: py + 1}, { x: px, y: py - 1}, { x: px - 1, y: py + 1}, { x: px - 1, y: py}, { x: px - 1, y: py - 1});
const edges = [...filled];
filled.push({ x: px, y: py})

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
  drawTiles(enclosed);

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
    if(trail.length > 0){
      trail.push({ x: px, y: py });
      enclosed = getEnclosedShape();
      trail = [];
    }
    //getInsideTile(getEnclosedShape());
  }else{
    trail.push({ x: px, y: py });
    for (const element of filled) {
      if(!px == element.x && !py == element.y){
        edges.push({ x: px, y: py });
      }
    }
  }
}

//Returns array of neighbors in the edges array to the given node.
function getNeighbors(node){
  let neighbors = [];
  let potentialNeighbors = getPotentialNeighbors(node);
  for(const potneigh of potentialNeighbors){
    for(const edge of edges){
      if(edge.x == potneigh.x && edge.y == potneigh.y){
        neighbors.push({ x: potneigh.x, y: potneigh.y});
      }
    }
  }
  return neighbors;
}

function getPotentialNeighbors(node){
  return [{x: node.x+1, y: node.y}, {x: node.x-1, y: node.y}, {x: node.x, y: node.y+1}, {x: node.x, y: node.y-1}];
}

// checks if a given point is on the trail.
function matchesTrail(pos_x, pos_y) {
  for (var i = 0; i < trail.length; i++) {
    if (trail[i].x == pos_x && trail[i].y == pos_y) {
        return true;
    }
  }
  return false;
}

// checks if a given point is on the filled area.
function matchesFilled(pos_x, pos_y) {
  for (var i = 0; i < filled.length; i++) {
    if (filled[i].x == pos_x && filled[i].y == pos_y) {
        return true;
    }
  }
  return false;
}

// Fills zone from a given starting point
function flood_fill(pos_x, pos_y) {

  // if there is no wall or if I haven't been there
  if(matchesFilled(pos_x, pos_y) || matchesTrail(pos_x, pos_y)) 
     return;                                              
  
  filled.push({x:pos_x, y:pos_y})  
  
  flood_fill(pos_x + 1, pos_y);  // then i can either go south
  flood_fill(pos_x - 1, pos_y);  // or north
  flood_fill(pos_x, pos_y + 1);  // or east
  flood_fill(pos_x, pos_y - 1);  // or west
  
  return;
}
function nodesMatch(node1, node2, xinc, yinc) {
  if (node1.x == node2.x+xinc && node1.y == node2.y+yinc) {
    return true;
  }
  return false;
}

function includesSameCoordinates(array, toBeCheckedNode){
  for(const node of array){
    if(node.x == toBeCheckedNode.x && node.y == toBeCheckedNode.y){
      return true;
    }
  }
  return false;
}

function getInsideTile(EnclosedShape){

}

// Returns an array of a shape created by the trail and edges of connected shapes.
function getEnclosedShape(){
  let tile = trail[trail.length-1];
  let shapeEdges = [...trail];
  let neighbors = [];
  let bruh = 0;
  while (!includesSameCoordinates(getPotentialNeighbors(tile), trail[0]) && bruh < 50){
    bruh++;
    neighbors = [...getNeighbors(tile)];
    for(const neighbor of neighbors){
      if(!includesSameCoordinates(shapeEdges, neighbor) && includesSameCoordinates(edges, neighbor)){
        tile = neighbor;
      }
    }
    shapeEdges.push(tile);
  }  
  return shapeEdges;
}

function drawTiles(tbdArray){
  ctx.fillStyle = "purple";
  for (var i = 0; i < tbdArray.length; i++){
    ctx.fillRect(tbdArray[i].x * gs, tbdArray[i].y * gs, gs - 2, gs - 2);
  }
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