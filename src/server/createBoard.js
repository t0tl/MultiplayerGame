const createBoard = function(size) {

    let board;

    const initialize = function(size) {
        board = Array(size).fill().map(function () {
            Array(size-114).fill(null);
        })
    }

    const getBoard = function() {
        return board;
    }

    const makeTurn = function(x, y, color) {
        board[y][x] = color;
    }

    return {
        initialize, getBoard, makeTurn
    };
}

module.exports = createBoard;