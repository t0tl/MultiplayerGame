const createBoard = function() {

    let board;
    let colorList = ["placeHolder"];
    let idList = ["placeHolder"];
    let pxList = ["placeHolder"];
    let pyList = ["placeHolder"];
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
        if (x < 0 || x > board.length-1 || y < 0 || y > board[0].length-1) {
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
            board[x][y] = Math.abs(type);
            // Floodfill
            getInsideTiles(x, y, type);
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
        if (pos_x < 0 || pos_x > 98 || pos_y < 0 || pos_y > 50) {
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

    const sideChecker = function(x, y, type) {
        // if x changed, then we need to choose up or down.
        // if y changed, then we need to determine right or left. 
        // We can do this by walking right and left at the same time until we reach a border.
        const safeType = Math.abs(type);
        const xv1 = xv[safeType];
        const yv1 = yv[safeType];
        let x1 = x - xv1;
        let y1 = y - yv1;

        let foundTrail = [false, false];
        let j = 1;
        let p = 0;
        let m = 0;
        if (xv1 == 0 && yv1 != 0) {
            while(!(foundTrail[0] || foundTrail[1]) && j<98) {
                if (x1+j < 98) {
                    p = j;
                }
                if (x1-j > 0){
                    m = j;
                }
                foundTrail[0] = matchesOwnTrail(x1+p, y1, type);
                foundTrail[1] = matchesOwnTrail(x1-m, y1, type);
                j++;
            }
        }
            //Måste kolla längre än 0 om man är vid väggen. Rita ett streck istället.
        else if (xv1 != 0 && yv1 == 0) {
            while(!(foundTrail[0] || foundTrail[1]) && j<50) {
                if (y1+j < 50) {
                    p = j;
                }
                if (y1-j > 0){
                    m = j;
                }
                foundTrail[0] = matchesOwnTrail(x1, y1+p, type);
                foundTrail[1] = matchesOwnTrail(x1, y1-m, type);
                j++;
            }
        }

        return foundTrail;
    }

    const getInsideTiles = function(x, y, type){
        const safeType = Math.abs(type);
        let x1 = x - xv[safeType];
        let y1 = y - yv[safeType];
        let side = [];
        side = sideChecker(x, y, type);
        if (xv[safeType] == 0 && yv[safeType] != 0) {
            if (side[0]) {
                floodFill(x1+1, y1, type);
            }
            else if (side[1]) {
                floodFill(x1-1, y1, type);
            }
        }
    
        else {
            if (side[0]) {
                floodFill(x1, y1+1, type);
            }
            else if (side[1]) {
                floodFill(x1, y1-1, type);
            }
        }
    }

    return {
        newPlayer, updateVelocity, getUpdatedBoard, initializeBoard, disconnected
    };
}

module.exports = createBoard;