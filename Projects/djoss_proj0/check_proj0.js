var fs = require('fs');
var assert = require('assert');

// Read file in, also makes sure it has the right name
eval(fs.readFileSync('projzero.js')+'');

// Task 1
assert(inc(1));
console.log("Task 1 checked");

// Task 2
assert(counter());
console.log("Task 2 checked");

// Task 3
var inc_0 = Inc();
var inc_1 = Inc();
assert.notStrictEqual(inc_0, inc_1);
console.log("Task 3 checked");

// Task 4
var counter_0 = Counter();
var counter_1 = Counter();
assert.notStrictEqual(counter_0, counter_1);
console.log("Task 4 checked");

// Task 5
var counterFrom_0 = CounterFrom(1);
var counterFrom_1 = CounterFrom(1);
assert.notStrictEqual(counterFrom_0, counterFrom_1);
console.log("Task 5 checked");

// Task 6
var arr = makeArray(1, 2);
assert.strictEqual(typeof(arr), 'object');
console.log("Task 6 checked");

// Task 7
var arr = carefulMakeArray(1, 2);
assert.strictEqual(typeof(arr),'object');
assert.throws(function(){carefulMakeArray(-1,2)});
assert.throws(function(){carefulMakeArray('one',2)});

try {
    carefulMakeArray(-1,2)
}
catch(err) {
    assert(err.name);
    assert(err.message);
}

console.log("Task 7 checked");

// Task 8
var arr = incArray(3);
assert.strictEqual(typeof(arr),'object');
assert.strictEqual(typeof(arr[0]), 'function');
assert.throws(function(){incArray(-1,2)});
assert.throws(function(){incArray('one',2)}, "");

try {
    incArray(-1,2)
}
catch(err) {
    assert(err.name);
    assert(err.message);
}

console.log("Task 8 checked");

// Task 9
var arr = counterFromArray(3);
assert.strictEqual(typeof(arr),'object');
assert.strictEqual(typeof(arr[0]), 'function');
assert.throws(function(){counterFromArray(-1,2)});
assert.throws(function(){counterFromArray('one',2)});

try {
    counterFromArray(-1,2)
}
catch(err) {
    assert(err.name);
    assert(err.message);
}

console.log("Task 9 checked");

console.log("Success! All tasks have passed our checker.");