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
            console.log([pxList[i], pyList[i]]);
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
        if (x < 0 || x > board.length-1 || y < 0 || y > board[0].length-1 || matchesOwnTrail(x, y, type)) {
            resetPlayer(type);
            return;
        }
        if (matchesOtherTrail(x, y, type)) {
            resetPlayer(board[x][y]);
            board[x][y] = type;
            return;
        }
        if (matchesOwnFilled) {
            //Floodfill
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

    const matchesOwnFilled = function(x, y) {
        if (board[x][y] == type && board[x][y] > 0) {
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

    return {
        newPlayer, updateVelocity, getUpdatedBoard, initializeBoard, disconnected
    };
}

module.exports = createBoard;