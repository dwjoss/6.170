/*
Graphics work
https://coderwall.com/p/irdyuq for reference on HTML Canvas
*/

// these constants were chosen after some experimentation in the browser
var CANVAS_HEIGHT = 500;
var CANVAS_WIDTH = 500;
var PIXEL_SIZE = 5;
var ALIVE_COLOR = '#FFFFFF'
var DEAD_COLOR = '#000000'
var NUM_CELLS_HORZ = 100;
var NUM_CELLS_VERT = 100;
var STEP_DELAY = 50; 
// alive cells/total cells
var PERCENT_LIVE_CELLS = 0.10;
// set DEBUG to true when running tests/test.html, false when running game/gameOfLife.html
var DEBUG = true;

/*
Draw the whole game Board

board: the Game of Life Board to draw
*/
function drawBoard(board) {
    for (var i = 0; i < board.x; i++) {
        for (var j = 0; j < board.y; j++) {
            drawCell(i, j, board.state[j][i]);
        }   
    }   
}

/*
Draw a single cell of the game Board (a rectangle)

x: the x-coordinate of the desired cell; 0 <= x < this.x and x is an integer
y: the y-coordinate of the desired cell; 0 <= y < this.y and y is an integer
isAlive: whether the cell is alive at the current timestep
*/
function drawCell(x, y, isAlive) {
    context.beginPath();
    context.rect(x*PIXEL_SIZE, y*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);

    if (isAlive) {
        context.fillStyle = ALIVE_COLOR;
    }   
    else {
        context.fillStyle = DEAD_COLOR;
    }   

    context.fill();
}

// yay proj0, yay closures
var counter = (function() {
    var numCalls = 1;

    return function() {
        return numCalls++;
    }
})();

// draw when not intending to run tests
if (!DEBUG) {
    var canvas = document.getElementById('game');
    var context = canvas.getContext('2d');
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;

    var myBoard = new Board(NUM_CELLS_HORZ, NUM_CELLS_VERT);
    myBoard.randomize();

    /*
    Repeatedly step the Board through time and draw the result; delay of STEP_DELAY ms between timesteps
    */
    setInterval(function() {
        drawBoard(myBoard);
        myBoard.update();
        // keep track of what generation we on
        document.getElementById("counter").innerHTML = "Generation #: " + counter();
    },
    STEP_DELAY
    );
}
