const createBoard = function(size) {

    let board;
    let colorList = ["placeHolder"];
    let idList = ["placeHolder"];
    let pxList = ["placeHolder"];
    let pyList = ["placeHolder"];
    let xv = ["placeHolder"];
    let yv = ["placeHolder"];

    const initializeBoard = function(size) {
        board = Array(size).fill().map(() => Array(size-50).fill(0));
    }

    initializeBoard(size);

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
        let px = Math.floor(Math.random() * 150)+5;
        let py = Math.floor(Math.random() * 40)+5;
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
        xv[id] = xv1;
        yv[id] = yv1;
    }

    const makeTurn = function(x, y, type) {
        board[x][y] = type;
    }

    return {
        newPlayer, updateVelocity, getUpdatedBoard
    };
}

module.exports = createBoard;