/*
DOM/Graphical Work
*/
var board = Board(WIDTH, HEIGHT); // the board to use; WIDTH and HEIGHT are defined in board.js
var STEP_DELAY = 250; // how often the board is updated (milliseconds) 

/*
Counter to keep track of what generation the board is on
*/
counter = (function() {
    var numCalls = 0;
    return {
        increment: function() {
            numCalls++;
        },
        reset: function() {
            numCalls = 0;
        },
        getValue: function() {
            return numCalls;
        }
    }
})();

$(document).ready(function() {
    
    var isPaused = true; // whether the game is currently paused

    /*  
    Create the DOM Board. Here, it consists of an HTML table with board.x width and board.y height.
    The color of a cell (defined in style.css) indicates whether it is alive or dead. 
    
    "Alive" table cells belong to the "live" td class
    "Dead" table cells belong to the "dead" td class
    Each cell also has two custom attributes: "data-i" and "data-j" (representing x-coordinate and y-coordinate
    of the corresponding cell, respectively)
    */
    function createTable(board) {
        var table = $("<table></table>");

        for (var i = 0; i < board.getX(); i++) {
            // new row
            var row = $("<tr></tr>").appendTo(table);

            for (var j = 0; j < board.getY(); j++) {
                if (board.getValue(i, j)) {
                    $("<td></td>").attr("class", "live")
                                  .attr("data-i", i)
                                  .attr("data-j", j)
                                  .appendTo(row);
                }   
                else {
                    $("<td></td>").attr("class", "dead")
                                  .attr("data-i", i)
                                  .attr("data-j", j)
                                  .appendTo(row);
                }   
            }   
        }   
        table.appendTo("#game");
        // each cell has an event listener
        $("td").bind("click", toggleState);
    }   
    
    /*  
    Display the updated table
    */
    function updateTable(board) {
        document.getElementById("game").innerHTML = ""; 
        board.update();
        createTable(board);
    }
    
    /*
    When a cell is clicked, toggle its state from alive to dead (or vice versa), and update
    the underlying state representation as well
    */
    function toggleState(evt) {
        var cell = evt.currentTarget;
        
        if (isPaused) {
            if (cell.getAttribute("class") === "dead") {
                board.makeAlive(cell.getAttribute("data-i"), cell.getAttribute("data-j"));
                cell.setAttribute("class", "alive");
            }
            else {
                board.makeDead(cell.getAttribute("data-i"), cell.getAttribute("data-j"));
                cell.setAttribute("class", "dead");
            }
        }
    }
    
    /*
    Pause the game
    */
    function pause() {
        isPaused = true;
    }
    
    /*
    Start the game
    */
    function start() {
        isPaused = false;
    }
    /*
    Randomize the board state
    */
    function randomize() {
        // counter is back at generation 0
        counter.reset();
        pause();
        
        // new board
        board = Board(WIDTH, HEIGHT);
        board.randomize();
        
        document.getElementById("game").innerHTML = "";
        document.getElementById("counter").innerHTML = "Generation #: 0";
        
        createTable(board);
    }

    // event listeners for the game buttons
    document.getElementById("start").addEventListener("click", start);
    document.getElementById("pause").addEventListener("click", pause);
    document.getElementById("randomize").addEventListener("click", randomize);
    
    // display the initial board
    createTable(board);

    // set updating in motion; update once every STEP_DELAY milliseconds
    setInterval(function() {
        if (!isPaused) {
            updateTable(board);
            
            // keep track of generation
            counter.increment();
            document.getElementById("counter").innerHTML = "Generation #: " + counter.getValue();
        }
    },
    STEP_DELAY
    );
});

