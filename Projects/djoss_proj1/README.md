proj1
=====

Game of Life

How to Run
==========
Simply open game/gameOfLife.html in your favorite web browser and follow the instructions on the page.

What's Included
===============
game/board.js: the internal logic for the Game of Life internal representation.

game/graphics.js: the code for drawing the Board object in the browser using DOM elements

game/style.css: the CSS for gameOfLife.html

game/gameOfLife.html: the page in which the graphical Game of Life takes place.

tests/tests.js: QUnit tests.

tests/test.html: the page in which to run the QUnit tests and view the results

Highlights
==========
<ul>
    <li>Almost complete separation of internal and graphics logic means little-to-no-dependence on the graphics library used</li>
    <li>The internal <a href="https://github.com/6170-fa14/djoss_proj1/blob/master/game/board.js#L28">state</a> of the game board 
    is hidden from the user via closures and may only be modified via the provided methods; direct modification is not allowed</li>
    <li>Thorough <a href="https://github.com/6170-fa14/djoss_proj1/blob/master/tests/tests.js#L5">test suite</a>; the internal game 
    methods are easily unit-tested</li>
</ul>

Help Wanted
===========
<ul>
    <li>A lot of fairly computationally-intensive work e.g. re-drawing the board at each time step, the closures, etc. What are
    some areas that I could re-work in order to reduce the amount of computation, and what are some possible alternatives to my
    current approaches?</li>
</ul>

Design Choices and Justifications
=================================
The system to be built is a basic Game of Life simulation, an experiment in cellular automation.

The Game of Life structure is simply a 2D grid of squares. What simpler data structure is there to represent
a 2D grid than an array of arrays? This 2D array is easily translatable to the graphical game board - 
a 1 value could represent an alive cell, and a 0 value a dead cell. The array is easily manipulable as well.

In the DOM phase of the project, a good choice for the graphical representation is an HTML table, with the 
background colors of the cells indicating whether the cells are alive or dead. The table is also easily manipulable.

I chose not to have the border cells "wrap around" (i.e. I don't consider cells on the left edge of the board
to have cells on the right edge of the board as neighbors). I didn't think the increase in functionality
was commensurate with the increase in complexity necessary to implement such a feature. In determining the neighbors 
of a cell, I would have to have a bunch of edge/corner case checks for cells on all four sides of the board.

I tried to make my code as modular I could, making each method's purpose singular and easily-testable using QUnit.
I almost completely separated the internal board logic from the drawing logic so as to limit my dependence on the 
graphics library used.

The randomize feature (my "additional" feature) is a cool way to allow the user to quickly load a starting configuration
and see some interesting patterns.

One drawback to my current implementation is the amount of computation done in drawing the board; I re-draw it at each time
step. Feedback on this would be appreciated.
