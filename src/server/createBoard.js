const createBoard = function(size) {

    const clear = function(size) {
        board = Array(size).fill().map(function () {
            Array(size).fill(null);
        })
    }

    const getBoard = function() {
        return board;
    }

    const makeTurn = function(x, y, color) {
        board[y][x] = color;
    }

    return {
        clear, getBoard, makeTurn
    };
}

module.exports = createBoard;