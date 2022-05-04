window.onload=function() {
    canvas = document.querySelector('canvas'); // Select canvas
    ctx = canvas.getContext("2d"); // Select the context for the canvas
    document.addEventListener("keydown", keyPush); // Listen for keyboard presses.
    setInterval(game,100); // Run function game every 100 ms.
}
px = py = 10; // Player position
gs = tc = 20; // gs = graphic scaling, tc = tile count
xv = yv = 0; // x and y velocity
trail=[]; // Array holding objects
//tail=5; // Length of snake

function game() {
    px+=xv; // Change snake x position by x velocity
    py+=yv; // Change snake y position by y velocity
    if (px<0) { 
        //px = tc-1;
        return;
    }
    if (px>tc-1) {
        //px = 0;
        return;
    }
    if (py<0) {
        //py = tc-1;
        return;
    }
    if (py>tc-1) {
        //py = 0;
        return;
    }
    // Background
    ctx.fillStyle="black"; 
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    // Render snake.
    ctx.fillStyle="lime";
    for(var i=0; i<trail.length; i++) {
        // Draw each piece of the snake.
        ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
        if (trail[i].x == px && trail[i].y==py) {
            //Put different screen here 
            //and tell to press key to begin
            //ctx.fillStyle="black";
            //ctx.fillRect(0,0,canvas.width,canvas.height);
        }
    }
    // Adds a tile object to the trail array.
    trail.push({x:px,y:py});

    // Make snake non-continous
    /*
    while(trail.length>tail) {
        trail.shift();
    }
    */
}

function keyPush(event) {
    switch(event.keyCode) {
        // Left arrow
        case 37:
            xv=-1;yv=0;
            break;
        // Down arrow
        case 38:
            xv=0;yv=-1;
            break;
        // Right arrow
        case 39:
            xv=1;yv=0;
            break;
        // Up arrow 
        case 40:
            xv=0;yv=1;
            break;
    }
}