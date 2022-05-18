'use strict';
const renderBoard = function(canvas, trail, filled){
  let ctx = canvas.getContext("2d");
  const gs = canvas.height*0.02;
  let px = canvas.width/(2*gs)-1; 
  let py = canvas.height/(2*gs)-1; 
  let xv = 0;
  let yv = 0;

  const drawBackground = function() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const restartGame = function() {
    drawBackground();
    px = canvas.width/(2*gs)-1;
    py = canvas.height/(2*gs)-1;
    xv = 0;
    yv = 0;
    trail = []; // Array holding limbo-tiles
    filled = []; // Array holding filled tiles
    filled.push({ x: px, y: py-2}, { x: px + 1, y: py - 1}, { x: px + 1, y: py-2}, { x: px + 1, y: py - 3}, { x: px, y: py - 1}, { x: px, y: py - 3}, { x: px - 1, y: py - 1}, { x: px - 1, y: py-2}, { x: px - 1, y: py - 3});
  }

  const drawClaimedTiles = function(){
    ctx.fillStyle = "blue";
    for (var i = 0; i < filled.length; i++){
      ctx.fillRect(filled[i].x * gs, filled[i].y * gs, gs - 2, gs - 2);
    }
  }

  const matchesTrail = function(pos_x, pos_y) {
    for (var i = 0; i < trail.length; i++) {
      if (trail[i].x == pos_x && trail[i].y == pos_y) {
          return true;
      }
    }
  
    return false;
  }
  
  const matchesFilled = function (pos_x, pos_y) {
    for (var i = 0; i < filled.length; i++) {
      if (filled[i].x == pos_x && filled[i].y == pos_y) {
          return true;
      }
    }
  
    return false;
  }

  const flood_fill = function(pos_x, pos_y) {
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
    sock.emit("move", [xv,yv])
  }

  const getInsideTiles = function(){
    let lastNode = trail[trail.length-1]; // Max two ways to enter a filled node.
    let secLastNode = trail[trail.length-2]; // Check from where we entered.
    let combs = [];
    let k = 0;
    let side = [];
    combs.push({x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0});
    for (let i = 0; i<combs.length; i++) {
      if (nodesMatch(lastNode, secLastNode, combs[i].x, combs[i].y)) {
        side = sideChecker(i);
        k = i
      }
    }
    if (k<2) {
      if (side[0]) {
        flood_fill(secLastNode.x+1, secLastNode.y);
      }
      else {
        flood_fill(secLastNode.x-1, secLastNode.y);
      }
    }
  
    else {
      if (side[0]) {
        flood_fill(secLastNode.x, secLastNode.y+1);
      }
      else {
        flood_fill(secLastNode.x, secLastNode.y-1);
      }
    }
    filled = filled.concat(trail);
    drawClaimedTiles();
    trail = [];
  }

  const sideChecker = function(i) {
    // if x changed, then we need to choose up or down.
    // if y changed, then we need to determine right or left. 
    // We can do this by walking right and left at the same time until we reach a border.
  
    let foundTrail = [false, false];
    let j = 1;
  
    switch(i) {
      case 0:
        //Check left or right
        while(foundTrail[0] || foundTrail[1]) {
          foundTrail[0] = matchesTrail(x+j, y);
          foundTrail[1] = matchesTrail(x-j, y);
          j++;
        }
        break;
      case 1:
        //Check left or right
        while(foundTrail[0] || foundTrail[1]) {
          foundTrail[0] = matchesTrail(x+j, y);
          foundTrail[1] = matchesTrail(x-j, y);
          j++;
        }
        break;
      case 2:
        //Check up or down
        while(foundTrail[0] || foundTrail[1]) {
          foundTrail[0] = matchesTrail(x, y+j);
          foundTrail[1] = matchesTrail(x, y-j);
          j++;
        }
        break;
      case 3:
        //Check up or down
        while(foundTrail[0] || foundTrail[1]) {
          foundTrail[0] = matchesTrail(x, y+j);
          foundTrail[1] = matchesTrail(x, y-j);
          j++;
        }
        break;
    }
    return foundTrail;
  }

  const game = function() {
    px += xv; // Change snake x position by x-velocity
    py += yv; // Change snake y position by y-velocity
    if (px < 0 || px > canvas.width/gs-1 || py < 0 || py > canvas.height/gs-1 || matchesTrail(px, py)) {
      restartGame();
    }

    drawClaimedTiles();
    
    // Adds new tile to snake
    ctx.fillStyle = "lime";
    ctx.fillRect(px * gs, py * gs, gs - 2, gs - 2);
    trail.push({x:px,y:py});

    if (matchesFilled(px, py)) {
      getInsideTiles();
    }
  
    else {
      trail.push({ x: px, y: py });
    }
  }

  drawBackground();
  return {game, keyPush};
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
  let trail = []; // Array holding snake
  let filled = []; // Array holding filled tiles
  const {game, keyPush} = renderBoard(canvas, trail, filled);
  const sock = io();
  sock.on("init", function (filled) {
    renderBoard(canvas, trail, filled);
  });

  window.onload = function () {
    document.addEventListener("keydown", keyPush); // Listen for keyboard presses.
    setInterval(game, 100); // Run function game every 100 ms. 
    // Exchange game to render game
  }
})();