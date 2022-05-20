'use strict';

const restartGame = function() {
    text.style.display = "block";
    px = 10;
    py = 10;
    xv = 0;
    yv = 0;
    edges = [];
    enclosed = [];
    trail = []; // Array holding limbo-tiles
    filled = []; // Array holding filled tiles
    filled.push({ x: px + 1, y: py + 1}, { x: px + 1, y: py}, { x: px + 1, y: py - 1}, { x: px, y: py + 1}, { x: px, y: py - 1}, { x: px - 1, y: py + 1}, { x: px - 1, y: py}, { x: px - 1, y: py - 1});
    edges = [...filled];
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
let edges = [];
let enclosed = [];
let trail = []; // Array holding snake
let filled = []; // Array holding filled tiles
filled.push({ x: px + 1, y: py + 1}, { x: px + 1, y: py}, { x: px + 1, y: py - 1}, { x: px, y: py + 1}, { x: px, y: py - 1}, { x: px - 1, y: py + 1}, { x: px - 1, y: py}, { x: px - 1, y: py - 1});
edges = [...filled];
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
  //drawTiles(enclosed);

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
      //enclosed = [];
      trail.push({ x: px, y: py });
      enclosed = getFastestPath();
      //trail = [];
      pushEachElement(filled, enclosed);
      pushEachElement(edges, enclosed);
      getInsideTile(enclosed);
      enclosed = [];
      trail = [];
    }
  }else{
    trail.push({ x: px, y: py });
    for (const element of filled) {
      if(!px == element.x && !py == element.y){
        edges.push({ x: px, y: py });
      }
    }
  }
}

function outOfBounds(node){
  let outOfBounds = true;
  if(node.y < canvas.height/gs-1 && node.y > 0 && node.x < canvas.width/gs-1 && node.x > 0){
    outOfBounds = false;
  }
  return outOfBounds;
}

function pushEachElement(toBeFilled, toBePushed){
  for(const element of toBePushed){
    if(!includesSameCoordinates(toBeFilled, element)){
      toBeFilled.push(element);
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

// right, left, up, down
function getPotentialNeighbors(node){
  return [{x: node.x+1, y: node.y}, {x: node.x-1, y: node.y}, {x: node.x, y: node.y+1}, {x: node.x, y: node.y-1}];
}

// checks if a given point is on the trail.
function matchesEnclosed(pos_x, pos_y) {
  for (var i = 0; i < enclosed.length; i++) {
    if (enclosed[i].x == pos_x && enclosed[i].y == pos_y) {
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
  if(matchesFilled(pos_x, pos_y) || matchesEnclosed(pos_x, pos_y) || outOfBounds({x: pos_x, y: pos_y})){
    return;                                              
  }
    
  filled.push({x:pos_x, y:pos_y})  
  
  flood_fill(pos_x + 1, pos_y);  // then i can either go south
  flood_fill(pos_x - 1, pos_y);  // or north
  flood_fill(pos_x, pos_y + 1);  // or east
  flood_fill(pos_x, pos_y - 1);  // or west
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

function getInsideTile(enclosedShape){
  let walls = [];
  let roofs = [];
  let corners = [];
  let neighborNodes = [];
  // Finds all walls and roofs of the enclosed shape. Also the corners.
  for(const node of enclosedShape){
    // [right, left, up, down]
    neighborNodes = getPotentialNeighbors(node);
    if(includesSameCoordinates(enclosedShape, neighborNodes[0]) && includesSameCoordinates(enclosedShape, neighborNodes[1])){
      roofs.push(node);
    } else if(includesSameCoordinates(enclosedShape, neighborNodes[3]) && includesSameCoordinates(enclosedShape, neighborNodes[2])){
      walls.push(node);
    } else{
      corners.push(node);
    }
  }

  for(const roof of roofs){
    neighborNodes = getPotentialNeighbors(roof);
    if(inside(neighborNodes[3], roofs, walls, corners)){
      flood_fill(neighborNodes[3].x, neighborNodes[3].y);
    } else if(inside(neighborNodes[2], roofs, walls, corners)){
      flood_fill(neighborNodes[2].x, neighborNodes[2].y);
    }
    for(const wall of walls){
      neighborNodes = getPotentialNeighbors(wall);
      if(inside(neighborNodes[1], roofs, walls, corners)){
        flood_fill(neighborNodes[1].x, neighborNodes[1].y);
      } else if(inside(neighborNodes[0], roofs, walls, corners)){
        flood_fill(neighborNodes[0].x, neighborNodes[0].y);
      }
    }
  }
}

// Returns an array of a shape created by the trail and edges of connected shapes.
function getEnclosedShape(){
  let tile = trail[trail.length-1];
  let shapeEdges = [...trail];
  let neighbors = [];
  let bruh = 0;
  let completedShape = false
  while (!includesSameCoordinates(getPotentialNeighbors(tile), trail[0]) && bruh < 1000){
    bruh++;
    neighbors = [...getNeighbors(tile)];
    for(const neighbor of neighbors){
      if(!includesSameCoordinates(shapeEdges, neighbor) && includesSameCoordinates(edges, neighbor)){
        tile = neighbor;
      }
    }
    shapeEdges.push(tile);
    if(includesSameCoordinates(getPotentialNeighbors(tile), trail[0])){
      completedShape = true;
    }
  }
  if(!completedShape){
    throw new error('enclosed shape was not completed');
  }
  return shapeEdges;
}

function inside(node, roofs, walls, corners){
  let badParse = false;
  let parse = {x: node.x, y: node.y};
  let sideCount = 0;
  while(parse.x < canvas.width/gs-1 && parse.x > 0){
    parse = {x: parse.x + 1, y: parse.y};
    if(includesSameCoordinates(walls, parse)){
      sideCount++;
    }else if(includesSameCoordinates(roofs, parse) || includesSameCoordinates(corners, parse)){
      badParse = true;
    }
  }
  console.log('1');
  if(sideCount%2 == 1 && !badParse){
    return true;
  }
  badParse = false;
  parse = {x: node.x, y: node.y};
  sideCount = 0;
  while(parse.x < canvas.width/gs-1 && parse.x > 0){
    parse = {x: parse.x - 1, y: parse.y};
    if(includesSameCoordinates(walls, parse)){
      sideCount++;
    }else if(includesSameCoordinates(roofs, parse) || includesSameCoordinates(corners, parse)){
      badParse = true;
    }
  }
  console.log('2');
  if(sideCount%2 == 1 && !badParse){
    return true;
  }
  badParse = false;
  parse = {x: node.x, y: node.y};
  sideCount = 0;
  while(parse.y < canvas.height/gs-1 && parse.y > 0){
    parse = {x: parse.x, y: parse.y + 1};
    if(includesSameCoordinates(roofs, parse)){
      sideCount++;
    }else if(includesSameCoordinates(walls, parse) || includesSameCoordinates(corners, parse)){
      badParse = true;
    }
  }
  console.log('3');
  if(sideCount%2 == 1 && !badParse){
    return true;
  }
  badParse = false;
  parse = {x: node.x, y: node.y};
  sideCount = 0;
  while(parse.y < canvas.height/gs-1 && parse.y > 0){
    parse = {x: parse.x, y: parse.y - 1};
    if(includesSameCoordinates(roofs, parse)){
      sideCount++;
    }else if(includesSameCoordinates(walls, parse) || includesSameCoordinates(corners, parse)){
      badParse = true;
    }
  }
  console.log('4');
  if(sideCount%2 == 1 && !badParse){
    return true;
  }
  return false;

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

function valuePotentialPaths(startNode, endNode){
  let neighbors = [];
  let i = 0;
  let numberedPaths = []
  numberedPaths.push({x: startNode.x, y: startNode.y, val: 0})
  for(const valued of numberedPaths){
    neighbors = getNeighbors(valued);
    for(const neighbor of neighbors){
      if(!includesSameCoordinates(numberedPaths, neighbor)){
        numberedPaths.push({x: neighbor.x, y: neighbor.y, val: valued.val + 1})
        if(neighbor.x == endNode.x && neighbor.y == endNode.y){
          console.log(numberedPaths);
          return numberedPaths;
        }
      }
    }
  }
}

function getCorrespondingNode(node, tobeSearched){
  for(const newNode of tobeSearched){
    if(node.x == newNode.x && node.y == newNode.y){
      return newNode;
    }
  }
  return {val: -1}
}

function getFastestPath(){
  const startNeighbors = getNeighbors(trail[0]);
  const endNeighbors = getNeighbors(trail[trail.length - 1]);
  let fastestPath = [...trail];
  let neighbors;
  let nodeValue;
  let startNode;
  let endNode;
  let startFound = false;
  let endFound = false;

  for(const start of startNeighbors){
    if(!includesSameCoordinates(endNeighbors, start)){
      startNode = start;
      startFound = true;
    }
  }
  for(const end of endNeighbors){
    if(!includesSameCoordinates(startNeighbors, end)){
      endNode = end;
      endFound = true;
    }
  }
  if(!startFound){
    startNode = startNeighbors[0];
  }
  if(!endFound){
    endNode = endNeighbors[0];
  }
  const potentialPaths = valuePotentialPaths(startNode, endNode);
  let path = potentialPaths[potentialPaths.length - 1];
  fastestPath.push(path);
  let i = path.val;
  
  while(path.val != 0){
    i--;
    neighbors = getNeighbors(path);
    for(const neighbor of neighbors){
      nodeValue = getCorrespondingNode(neighbor, potentialPaths).val;
      if(nodeValue == 0){
        return fastestPath;
      }
      if(nodeValue == i){
        path = neighbor
        fastestPath.push(neighbor)
      }
    }
  }
}