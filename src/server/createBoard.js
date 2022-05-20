const createBoard = function() {

    let board;
    let colorList = ["placeHolder"];
    let idList = ["placeHolder"];
    let pxList = ["placeHolder"];
    let pyList = ["placeHolder"];
    let pxListLast = ["placeHolder"];
    let pyListLast = ["placeHolder"];
    let xv = ["placeHolder"];
    let yv = ["placeHolder"];

    const initializeBoard = function(size) {
        board = Array(size).fill().map(() => Array(size-49).fill(0));
    }

    const getBoard = function() {
        return [board, colorList, idList];
    }

    // Used for incrementing player positions
    const getUpdatedBoard = function() {
        for (let i = 1; i<pxList.length; i++) {
            pxList[i] += xv[i];
            pyList[i] += yv[i];
            makeTurn(pxList[i], pyList[i], -i);
        }
        return getBoard();
    }

    const getColorList = function() {
        return colorList;
    }

    const getIdList = function() {
        return idList;
    }

    const newPlayer = function(sock) {
        let px = Math.floor(Math.random() * board.length);
        let py = Math.floor(Math.random() * board[0].length);
        idList.push(sock.playerID);
        sock.arrElem = idList.length-1;
        let f = sock.arrElem;
        let p = -sock.arrElem;
        xv.push(0);
        yv.push(1);
        colorList.push(sock.color);
        for (let j=-1; j<2; j++) {
            for (let i=0; i<3; i++) {
                makeTurn(px+j, py-i, f);
            }
        }
        pxList.push(px);
        pyList.push(py+1);
        pxListLast.push(px);
        pyListLast.push(py);
        makeTurn(px, py+1, p);
        return getBoard();
    }

    const updateVelocity = function(xv1, yv1, id) {
        if ((xv[id] == 1 && xv1 == -1) || (xv[id] == -1 && xv1 == 1)) {
            return;
        }
        if ((yv[id] == 1 && yv1 == -1) || (yv[id] == -1 && yv1 == 1)) {
            return;
        }
        xv[id] = xv1;
        yv[id] = yv1;
    }

    const resetPlayer = function(type) {
        const f = Math.abs(type);
        for (let i=0; i<board.length; i++) {
            for (let j=0; j<board[0].length; j++) {
                if (board[i][j] == f || board[i][j] == -f) {
                    board[i][j] = 0;
                }
            }
        }
        xv[f]=0;
        yv[f]=1;
        let px = Math.floor(Math.random() * board.length);
        let py = Math.floor(Math.random() * board[0].length);
        for (let j=-1; j<2; j++) {
            for (let i=0; i<3; i++) {
                makeTurn(px+j, py-i, f);
            }
        }
        pxList[f]=px;
        pyList[f]=py+1;
        makeTurn(px, py+1, -f);
    }

    const makeTurn = function(x, y, type) {
        let safeType = [Math.abs(type)];
        if (pxListLast[safeType] == "h" && pyListLast[safeType] == "h") {
            pxListLast[safeType] = x;
            pyListLast[safeType] = y;
        }
        if (x < 0 || x > board.length-1 || isNaN(x) || isNaN(y) || y < 0 || y > board[0].length-1) {
            resetPlayer(type);
            return;
        }
        if (matchesOwnTrail(x, y, type)) {
            resetPlayer(type);
            return;
        }
        if (matchesOtherTrail(x, y, type)) {
            resetPlayer(board[x][y]);
            board[x][y] = type;
            return;
        }
        if (matchesOwnFilled(x,y, type)) {
            board[x][y] = safeType;
            // Floodfill
            getInsideTiles(x, y, type);
            pxListLast[safeType] = "h";
            pyListLast[safeType] = "h";
            return;
        }
        board[x][y] = type;
    }

    const matchesOwnTrail = function(x, y, type) {
        if (board[x][y] == type && board[x][y] < 0) {
            return true;
        }
        return false;
    }

    const matchesOtherTrail = function(x, y, type) {
        for (let i = 1; i<pxList.length; i++) {
            if ((board[x][y] != type) && (board[x][y]==-i)) {
                return true;
            }
        }
        return false;
    }

    const matchesOwnFilled = function(x, y, type) {
        if (board[x][y] == Math.abs(type) && board[x][y] > 0) {
            return true;
        }
        return false;
    }

    const disconnected = function(id) {
        for (let i=0; i<board.length; i++) {
            for (let j=0; j<board[0].length; j++) {
                if (board[i][j] == id || board[i][j] == -id) {
                    board[i][j] = 0;
                }
            }
        }
        colorList.splice(id, 1);
        idList.splice(id, 1);
        pxList.splice(id, 1);
        pyList.splice(id, 1);
        xv.splice(id, 1);
        yv.splice(id, 1);
    }

    const floodFill = function(pos_x, pos_y, type) {
        // if there is no wall or if I haven't been there
        if (pos_x < 0 || pos_x > board.length-1 || pos_y < 0 || pos_y > board[0].length-1) {
            return;
        }

        if (matchesOwnFilled(pos_x, pos_y, type)) {
            return;                                              
        }
        
        if (matchesOwnTrail(pos_x, pos_y, type)) {
            board[pos_x][pos_y] = Math.abs(type);
            return;
        }
        board[pos_x][pos_y] = Math.abs(type);
        
        floodFill(pos_x + 1, pos_y, type);  // then i can either go south
        floodFill(pos_x - 1, pos_y, type);  // or north
        floodFill(pos_x, pos_y + 1, type);  // or east
        floodFill(pos_x, pos_y - 1, type);  // or west
        
        return;
    }

    const getArray = function(type) {
        let array = [];
        for(var i = 0; i < 99; i++){
            for(var j = 0; j < 50; j++){
                if(board[i][j] == type){
                    array.push({x: i, y: j});
                }
            }
        }
        return array;
    }

    const getNeighbors = function(node, filled){
        let neighbors = [];
        potentialNeighbors = [{x: node.x+1, y: node.y}, {x: node.x-1, y: node.y}, {x: node.x, y: node.y+1}, {x: node.x, y: node.y-1}];
        for(const potneigh of potentialNeighbors){
            for(const fill of filled){
              if(fill.x == potneigh.x && fill.y == potneigh.y){
                neighbors.push({ x: potneigh.x, y: potneigh.y});
              }
            }
          }
          return neighbors;
    }

    const getInsideTiles = function(x, y, type){
        let walls = [];
        let roofs = [];
        let corners = [];
        let neighborNodes = [];
        let filled = getArray(type);
        let trail = getArray(-type);
        const enclosedShape = getFastestPath(x, y, trail, filled, type);

        const safeType = Math.abs(type);
        // Finds all walls and roofs of the enclosed shape. Also the corners.
        for(const node of enclosedShape){
            // [right, left, up, down]
            neighborNodes =  [{x: node.x+1, y: node.y}, {x: node.x-1, y: node.y}, {x: node.x, y: node.y+1}, {x: node.x, y: node.y-1}];
            if(includesSameCoordinates(enclosedShape, neighborNodes[0]) && includesSameCoordinates(enclosedShape, neighborNodes[1])){
                roofs.push(node);
            } else if(includesSameCoordinates(enclosedShape, neighborNodes[3]) && includesSameCoordinates(enclosedShape, neighborNodes[2])){
                walls.push(node);
            } else{
                corners.push(node);
            }
        }

        for(const roof of roofs){
            neighborNodes = [{x: roof.x+1, y: roof.y}, {x: roof.x-1, y: roof.y}, {x: roof.x, y: roof.y+1}, {x: roof.x, y: roof.y-1}];
            if(inside(neighborNodes[3], roofs, walls, corners)){
                floodFill(neighborNodes[3].x, neighborNodes[3].y, type);
            } else if(inside(neighborNodes[2], roofs, walls, corners)){
                floodFill(neighborNodes[2].x, neighborNodes[2].y, type);
            }
        }
        for(const wall of walls){
            neighborNodes = [{x: wall.x+1, y: wall.y}, {x: wall.x-1, y: wall.y}, {x: wall.x, y: wall.y+1}, {x: wall.x, y: wall.y-1}];
            if(inside(neighborNodes[1], roofs, walls, corners)){
                floodFill(neighborNodes[1].x, neighborNodes[1].y, type);
            } else if(inside(neighborNodes[0], roofs, walls, corners)){
                floodFill(neighborNodes[0].x, neighborNodes[0].y, type);
            }
        }
    }

    const getFastestPath = function(headx, heady, trail, filled, type){
        const safeType = Math.abs(type);
        let fastestPath = [...trail];
        let neighbors;
        let nodeValue;
        let startNode = {x: headx, y: heady};
        let endNode = {x: pxListLast[safeType], y: pyListLast[safeType]};
        let startNeighbors = getNeighbors(startNode, filled);;
        let endNeighbors = getNeighbors(endNode, filled);
        let startFound = false;
        let endFound = false;
      
        //might be obsolete.
        for(const start of startNeighbors){
            if(includesSameCoordinates(endNeighbors, start)){
              startNode = start;
              startFound = true;
            }    
        }
        if(!startFound){
            startNode = startNeighbors[0];
        }
        for(const end of endNeighbors){
            if(includesSameCoordinates(startNeighbors, end)){
              endNode = end;
              endFound = true;
            }    
        }
        console.log(endNode);
        //if(!endFound){
        //    endNode = endNeighbors[0];
        //}
        fastestPath.push(startNode);
        console.log(endNode);
        const potentialPaths = valuePotentialPaths(startNode, endNode, filled);
        let path = potentialPaths[potentialPaths.length - 1];
        fastestPath.push(path);
        let i = path.val;
        
        while(path.val != 0){
            i--;
            neighbors = getNeighbors(path, filled);
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

    const getCorrespondingNode = function(node, tobeSearched){
        for(const newNode of tobeSearched){
            if(node.x == newNode.x && node.y == newNode.y){
            return newNode;
            }
        }
        return {val: -1}
    }

    const includesSameCoordinates = function(array, toBeCheckedNode){
        for(const node of array){
          if(node.x == toBeCheckedNode.x && node.y == toBeCheckedNode.y){
            return true;
          }
        }
        return false;
    }

    const valuePotentialPaths = function(startNode, endNode, filled){
        let neighbors = [];
        let i = 0;
        let numberedPaths = []
        numberedPaths.push({x: startNode.x, y: startNode.y, val: 0})
        for(const valued of numberedPaths){
          neighbors = getNeighbors(valued, filled);
          for(const neighbor of neighbors){
            if(!includesSameCoordinates(numberedPaths, neighbor)){
              numberedPaths.push({x: neighbor.x, y: neighbor.y, val: valued.val + 1})
              if(neighbor.x == endNode.x && neighbor.y == endNode.y){
                return numberedPaths;
              }
            }
          }
        }
    }

    const inside = function(node, roofs, walls, corners){
        let badParse = false;
        let parse = {x: node.x, y: node.y};
        let sideCount = 0;
        while(parse.x < board.length && parse.x > 0){
          parse = {x: parse.x + 1, y: parse.y};
          if(includesSameCoordinates(walls, parse)){
            sideCount++;
          }else if(includesSameCoordinates(roofs, parse) || includesSameCoordinates(corners, parse)){
            badParse = true;
          }
        }
        if(sideCount%2 == 1 && !badParse){
          return true;
        }
        badParse = false;
        parse = {x: node.x, y: node.y};
        sideCount = 0;
        while(parse.x < board.length && parse.x > 0){
          parse = {x: parse.x - 1, y: parse.y};
          if(includesSameCoordinates(walls, parse)){
            sideCount++;
          }else if(includesSameCoordinates(roofs, parse) || includesSameCoordinates(corners, parse)){
            badParse = true;
          }
        }
        if(sideCount%2 == 1 && !badParse){
          return true;
        }
        badParse = false;
        parse = {x: node.x, y: node.y};
        sideCount = 0;
        while(parse.y < board[0].length && parse.y > 0){
          parse = {x: parse.x, y: parse.y + 1};
          if(includesSameCoordinates(roofs, parse)){
            sideCount++;
          }else if(includesSameCoordinates(walls, parse) || includesSameCoordinates(corners, parse)){
            badParse = true;
          }
        }
        if(sideCount%2 == 1 && !badParse){
          return true;
        }
        badParse = false;
        parse = {x: node.x, y: node.y};
        sideCount = 0;
        while(parse.y < board[0].length && parse.y > 0){
          parse = {x: parse.x, y: parse.y - 1};
          if(includesSameCoordinates(roofs, parse)){
            sideCount++;
          }else if(includesSameCoordinates(walls, parse) || includesSameCoordinates(corners, parse)){
            badParse = true;
          }
        }
        if(sideCount%2 == 1 && !badParse){
          return true;
        }
        return false;  
    }

    return {
        newPlayer, updateVelocity, getUpdatedBoard, initializeBoard, disconnected
    };
}

module.exports = createBoard;