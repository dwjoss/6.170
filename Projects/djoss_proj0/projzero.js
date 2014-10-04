//Project 0

// 1. 
function inc(x) {
    return x + 1;
}

// 2.
var counter = (function() {
    var numCalls = 1;
    
    return function() {
        return numCalls++;
    }
})();

// 3.
function Inc() {
    var inc = (function(x) {
        return x + 1;
    });

    return inc;
}

// 4. 
function Counter() {
    var counter = (function() {
        var numCalls = 1;

        return function() {
            return numCalls++;
        }
    })();

    return counter;
}

// 5. 
function CounterFrom(z) {
    var counterFrom = (function() {
        var numCalls = z + 1;

        return function() {
            return numCalls++;
        }
    })();
    
    return counterFrom;
}

// 6. 
function makeArray(n, v) {
    var array = [];

    for (i = 0; i < n; i++) {
        array.push(v);
    }

    return array;
}

// 7. 
function carefulMakeArray(n, v) {
    var exception = new Object(); // unused in case of valid arguments
    exception.name = 'BadSize';
     
    if (typeof n === 'number') {
        if (n >= 0) {
            return makeArray(n, v);
        }
        else {
            exception.message = 'Negative size';
        }
    }
    else {
        exception.message = 'Size is not a number';
    }

    throw exception;
}

// 8.
function incArray(n) {
    var exception = new Object(); //unused in case of valid arguments
    exception.name = 'BadSize';
    
    var array = [];

    if (typeof n === 'number') {
        if (n >= 0) {
            for (i = 0; i < n; i++) {
                array.push(Inc());
            }
            
            return array;
        }
        else {
            exception.message = 'Negative size';
        }
    }
    else {
        exception.message = 'Size is not a number';
    }

    throw exception;
}

// 9.
function counterFromArray(n) {
    var exception = new Object(); // unused in case of valid arguments
    exception.name = 'BadSize';

    var array = []

    if (typeof n === 'number') {
        if (n >= 0) {
            for (i = 0; i < n; i++) {
                array.push(CounterFrom(i));
            }

            return array;
        }
        else {
            exception.message = 'Negative size';
        }
    }
    else {
         exception.message = 'Size is not a number';
    }
    
    throw exception;
}
