// Data structures and methods for internal representation of Game of Life Board,
//
// Dylan Joss

/*
The Board on which the Game of Life occurs

x: the horizontal length of the board; must be a positive integer
y: the vertical length of the board; must be a positive integer
state: an array of arrays representing the Game of Life grid; state[y][x] is the cell at (x, y). 
    x-coordinates increase left-to-right, and y-coordinates increase going top to bottom, with the top left corner being (0, 0).
    state[y][x] = 1 iff cell (x, y) is alive, 0 iff cell (x, y) is dead.
    input is an optional argument. If not specified, state is initialized as a 2D array of all 0s. If specified, input.length must
    equal y, input[0].length must equal x, and input must be a 2D array of 1s and/or 0s.

Rep invariant: |{state[0], state[1], ..., state[state.length - 1]}| = x
               state.length = y
               all elements of the arrays of state are 1s or 0s
*/

var PERCENT_LIVE_CELLS = 0.10; // used in randomize
var WIDTH = 50; // number of cells across the board
var HEIGHT = 50; // number of cells down the board

function Board(width, height, input) {
    var x = width;
    var y = height;
    var state;

    // if a state is specified, use it
    if (input) {
        if (input[0].length !== x || input.length !== y) {
            throw {"name": "SizeError", "message": "state's dimensions do not match x or y"};
        }
        else {
            state = input;
        }
    }
    // initialize all the cells to be dead
    else {
        state = [];

        for (var i = 0; i < x; i++) {
            state.push([]);
        }

        for (var i = 0; i < x; i++) {
            for (var j = 0; j < y; j++) {
                state[i].push(0);
            }
        }
    }
    // the board object itself
    return {
        /*
        Return the x-dimension of the board
        */
        getX: function() {
            return x;
        },
        
        /*
        Return the y-dimension of the board
        */
        getY: function() {
            return y;
        },
        
        /*
        Return the value of cell (x, y), either 1 for alive or 0 for dead
        */
        getValue: function(x, y) {
            return state[y][x];
        },
        
        /*
        Revive cell (x, y) (i.e. represent it as a 1 in state)
        */
        makeAlive: function(x, y) {
            state[y][x] = 1;
        },
        
        /*
        Kill cell (x, y) (i.e. represent it as a 0 in state)
        */
        makeDead: function(x, y) {
            state[y][x] = 0;
        },
        
        /*
        Return the neighbors of cell (x, y)

        The neighbors list is an array of length-2 arrays, where array[0] is
        the neighbor's x-coordinate and array[1] is its y-coordinate
        */
        getNeighbors: function(x, y) {
            var neighbors = [];
            
            // look for neighbors in a 1 unit "radius" around the cell
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    var newX = x + i;
                    var newY = y + j;
                    
                    // a cell is not a neighbor of itself; a cell cannot have neighbors outside the Board
                    if (!(newX === x && newY === y) && newX > -1 && newX < this.getX() && newY > -1 && newY < this.getY()) {
                        neighbors.push([newX, newY]);
                    }
                }
            }
            
            return neighbors;
        },
        
        /*
        Get the number of live neighbors of a cell (i.e. adjacent cells whose value is 1 in state)
        */
        getNumLiveNeighbors: function(x, y) {
            var neighbors = this.getNeighbors(x, y);
            var numLiveNeighbors = 0;

            for (var i = 0; i < neighbors.length; i++) {
                if (this.getValue(neighbors[i][0], neighbors[i][1])) {
                    numLiveNeighbors += 1;
                }
            }

            return numLiveNeighbors;
        },
        
        /*
        Based on the values of its neighbors, determine whether a cell will be alive or dead in the next
        generation
        
        If a cell is to die in the next generation, return "die"
        If a cell is to become alive in the next generation, return "live"
        If a cell will maintain its current condition in the next generation, return "do nothing"
        */
        updateCell: function(x, y) { 
            var numLiveNeighbors = this.getNumLiveNeighbors(x, y);
               
            if (this.getValue(x, y)) {
                if (numLiveNeighbors < 2 || numLiveNeighbors > 3) {
                    return "die";
                }
            }
            else {
                if (numLiveNeighbors === 3) {
                    return "live";
                }
            }

            return "do nothing";
        },
        
        /*
        Determine the state of the board in the next generation and update it accordingly
        */
        update: function() {
            // the cells that will die in the next generation; array of length-2 arrays as in getNeighbors
            var toDie = [];
            // the cells that will live in the next generation; array of length-2 arrays as in getNeighbors
            var toLive = [];
            
            for (var i = 0; i < this.getX(); i++) {
                for (var j = 0; j < this.getY(); j++) {
                    var result = this.updateCell(i, j);

                    if (result === "die") {
                        toDie.push([i, j]);
                    }
                    else if (result === "live") {
                        toLive.push([i, j]);
                    }
                    // if result === "do nothing", we leave the cell be
                }
            }

            for (var i = 0; i < toDie.length; i++) {
                this.makeDead(toDie[i][0], toDie[i][1]);
            }
            for (var j = 0; j < toLive.length; j++) {
                this.makeAlive(toLive[j][0], toLive[j][1]);
            }
        },
        
        /*
        Randomly seed the board with alive cells to serve as a starting configuration.

        The percent of alive cells is defined in PERCENT_ALIVE_CELLS
        */
        randomize: function() {
            for (var i = 0; i < this.getX(); i++) {
                for (var j = 0; j < this.getY(); j++) {
                    if (Math.random() < PERCENT_LIVE_CELLS) {
                        this.makeAlive(i, j);
                    }
                    else {
                        this.makeDead(i, j);
                    }
                }
            }
        }
    }
}

