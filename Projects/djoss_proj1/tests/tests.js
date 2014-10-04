/*
Testing the backend representation of the Game of Life Board and its methods
*/

test("testing constructor", function() {
	var smallBoard = Board(1, 1)
	equal(smallBoard.getX(), 1, "small board x-dimension");
    equal(smallBoard.getY(), 1, "small board y-dimension");
    equal(smallBoard.getValue(0, 0), 0, "small board arbitrary cell value");

    var mediumBoard = Board(10, 10);
    equal(mediumBoard.getX(), 10, "medium board x-dimension");
    equal(mediumBoard.getY(), 10, "medium board y-dimension");
    equal(mediumBoard.getValue(0, 0), 0, "medium board arbitrary cell value #1");
    equal(mediumBoard.getValue(3, 4), 0, "medium board arbitrary cell value #2");
    equal(mediumBoard.getValue(9, 9), 0, "medium board arbitrary cell value #3");

    var largeBoard = Board(25, 25); 
    equal(largeBoard.getX(), 25, "large board x-dimension");
    equal(largeBoard.getY(), 25, "large board y-dimension");
    equal(largeBoard.getValue(0, 0), 0, "large board arbitrary cell value #1");
    equal(largeBoard.getValue(15, 7), 0, "large board arbitrary cell value #2");
    equal(largeBoard.getValue(24, 24), 0, "large board arbitrary cell value #3");

    var asymmetricBoard = Board(4, 9);
    equal(asymmetricBoard.getX(), 4, "asymmetric board x-dimension");
    equal(asymmetricBoard.getY(), 9, "asymmetric board y-dimension");
    equal(asymmetricBoard.getValue(6, 3), 0, "asymmetric board arbitrary cell value #1");
});

test("testing makeAlive and makeDead", function() {
    var board = Board(10, 10);
    board.makeAlive(5, 4);
    equal(board.getValue(5, 4), 1, "the cell made alive is indeed alive");
    equal(board.getValue(7, 3), 0, "other cells are not affected by the makeAlive call");
    board.makeDead(5, 4);
    equal(board.getValue(5, 4), 0, "the cell made alive is made dead");
});

test("testing getNeighbors", function() {
    var board = Board(3, 3);
    equal(board.getNeighbors(0, 0).length, 3, "upper left corner cell has 3 neighbors");
    deepEqual(board.getNeighbors(0, 0), [[0, 1], [1, 0], [1, 1]], "neighbors of upper left corner cell");
    equal(board.getNeighbors(2, 2).length, 3, "lower right corner cell has 3 neighbors");
    deepEqual(board.getNeighbors(2, 2), [[1, 1], [1, 2], [2, 1]], "neighbors of lower right corner cell");
    equal(board.getNeighbors(2, 0).length, 3, "upper right corner cell has 3 neighbors");
    deepEqual(board.getNeighbors(2, 0), [[1, 0], [1, 1], [2, 1]], "neighbors of upper right corner cell");
    equal(board.getNeighbors(0, 2).length, 3, "lower left corner cell has 3 neighbors");
    deepEqual(board.getNeighbors(0, 2), [[0, 1], [1, 1], [1, 2]], "neighbors of lower left corner cell");

    var largerBoard = Board(10, 10);
    equal(largerBoard.getNeighbors(0, 6).length, 5, "left edge cell has 5 neighbors");
    deepEqual(largerBoard.getNeighbors(0, 6), [[0, 5], [0, 7], [1, 5], [1, 6], [1, 7]], "neighbors of left edge cell");
    equal(largerBoard.getNeighbors(9, 5).length, 5, "right edge cell has 5 neighbors");
    deepEqual(largerBoard.getNeighbors(9, 5), [[8, 4], [8, 5], [8, 6], [9, 4], [9, 6]], "neighbors of right edge cell");
    equal(largerBoard.getNeighbors(5, 0).length, 5, "top edge cell has 5 neighbors");
    deepEqual(largerBoard.getNeighbors(5, 0), [[4, 0], [4, 1], [5, 1], [6, 0], [6, 1]], "neighbors of top edge cell");
    equal(largerBoard.getNeighbors(7, 9).length, 5, "bottom edge cell has 5 neighbors");
    deepEqual(largerBoard.getNeighbors(7, 9), [[6, 8], [6, 9], [7, 8], [8, 8], [8, 9]], "neighbors of bottom edge cell"); 
    equal(largerBoard.getNeighbors(4, 5).length, 8, "middle cell has 8 neighbors");
    deepEqual(largerBoard.getNeighbors(4, 5), [[3, 4], [3, 5], [3, 6], [4, 4], [4, 6], [5, 4], [5, 5], [5, 6]], "neighbors of middle cell");
});

test("testing getNumLiveNeighbors", function() {
    var board = Board(3, 3, [[0, 0, 1], [0, 0, 1], [0, 1, 0]]);
    equal(board.getNumLiveNeighbors(0, 0), 0, "cell with no live neighbors");
    equal(board.getNumLiveNeighbors(0, 2), 1, "cell with 1 live neighbor");
    equal(board.getNumLiveNeighbors(2, 2), 2, "cell with 2 live neighbors");
    equal(board.getNumLiveNeighbors(1, 1), 3, "cell with 3 live neighbors");
});

test("testing updateCell", function() {
    var board = Board(3, 3, [[0, 0, 1], [0, 0, 1], [0, 1, 0]]);
    equal(board.updateCell(2, 0), "die", "cell dies due to under-population");

    var board2 = Board(3, 3, [[1, 1, 0], [1, 0, 0], [0, 0, 0]]);
    equal(board2.updateCell(0, 0), "do nothing", "cell lives on to next generation");
    
    var board3 = Board(3, 3, [[0, 0, 0], [1, 1, 1], [1, 1, 0]]);
    equal(board3.updateCell(1, 2), "die", "cell dies due to over-population");

    var board4 = Board(3, 3, [[0, 0, 0], [1, 1, 1], [0, 0, 0]]);
    equal(board4.updateCell(1, 0), "live", "dead cell becomes alive by reproduction");
});

/* 
NOTE: these tests require access to the internal state of the board. I have disabled
such access in the interest of encapsulation; this test was run prior to submitting this
project (when I enabled a getState method).

test("testing update", function() {
    var board = Board(3, 3, [[1, 0, 0], [1, 1, 1], [0, 0, 0]]);
    board.update();
    deepEqual(board.getState(), [[1, 0, 0], [1, 1, 0], [0, 1, 0]], "dynamic board timestep 1");
    board.update();
    deepEqual(board.getState(), [[1, 1, 0], [1, 1, 0], [1, 1, 0]], "dynamic board timestep 2");
    board.update();
    deepEqual(board.getState(), [[1, 1, 0], [0, 0, 1], [1, 1, 0]], "dynamic board timestep 3");

    var staticBoard = Board(4, 4, [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
    staticBoard.update();
    deepEqual(staticBoard.getState(), [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], "static board timestep 1");
    staticBoard.update();
    deepEqual(staticBoard.getState(), [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], "static board timestep 2");
    staticBoard.update();
    deepEqual(staticBoard.getState(), [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]], "static board timestep 3");
});
*/
