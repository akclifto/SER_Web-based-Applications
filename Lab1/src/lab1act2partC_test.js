/**
 * SER 421 Lab 1
 * Acitivity 2: JS Programming Part C Test
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.10
 * 
 */
//  import PreCalc from "./lab1act2partC.js";

let pc = new PreCalc(0);

console.log("TESTING Part C trace Example() -----------------\n");

console.log(pc.calc('{"op" : "add", "number" : 5}'));  // returns 5, stack [0]
console.log(pc.calc('{"op" : "push", "number" : 5}')); // returns 5, stack [5 0]
console.log(pc.calc('{"op" : "pop"}')); // returns 5, stack [0].
console.log(pc.calc('{"op" : "push", "expr" : {"op" : "subtract", "number" : 2}}')); //return -2 stack [-2 0]
console.log(pc.calc('{"op" : "push", "expr" : {"op" : "add", "number" : 19}}')); //return 17 stack [17 -2 0]
console.log(pc.calc('{"op" : "print"}')); //prints [17 -2 0]
console.log(pc.calc('{"op" : "pop"}')); // returns 17, stack [-2 0]
console.log(pc.calc('{"op" : "print"}')); //prints [-2 0]
console.log(pc.calc('{"op" : "push", "expr" : {"op" : "subtract", "expr": {"op" : "pop"}}}')); // returns -2 stack [-2 0]
console.log(pc.calc('{"op" : "print"}')); //prints [-2 0]
console.log(pc.calc('{"op" : "pop"}')); // returns -2 stack [0]
console.log(pc.calc('{"op" : "pop"}')); // returns 0 stack []
console.log(pc.calc('{"op" : "pop"}')); // returns (what? You have an empty stack now)

console.log(pc.cleanup());
console.log("\n");

console.log("TESTING Part C calc() ---------------------------\n");

console.log(pc.calc('{"op" : "add", "number" : 5}'));          // 5
console.log(pc.calc('{"op" : "subtract", "number" : 2}'));     // 3
console.log(pc.calc('{"op" : "add", "number" : 19}'));         // 22
// nested expressions
console.log(pc.calc('{"op": "subtract", "expr" : {"op" : "add", "number" : 15}}'));    // 0
console.log(pc.calc('{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 3}}}')); // -12
console.log(pc.calc('{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "add", "number" : 6}}}')); // -24
console.log(pc.calc('{"op": "add", "expr" : {"op" : "subtract", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 1}}}}')); // 0

console.log(pc.cleanup());
console.log("\n");

console.log("TESTING Part C exec() ---------------------------\n");

// test mix of nested and single expressions
let expA = [
    { "exp": { "op": "add", "expr": { "op": "add", "expr": { "op": "subtract", "number": 3 } } }, "expected": -12 },
    { "exp": { "op": "subtract", "expr": { "op": "add", "number": 15 } }, "expected": 0 },
    { "exp": { "op": "add", "number": 0 }, "expected": 0 },
    { "exp": { "op": "add", "number": -1 }, "expected": -1 },
    { "exp": { "op": "subtract", "number": -1 }, "expected": 0 },
    { "exp": { "op": "add", "number": 5 }, "expected": 5 },
    { "exp": { "op": "subtract", "number": 10 }, "expected": -5 },
    { "exp": { "op": "add", "number": 15 }, "expected": 10 },
    { "exp": { "op": "add", "expr": { "op": "add", "expr": { "op": "subtract", "number": 3 } } }, "expected": 28 },
    { "exp": { "op": "subtract", "expr": { "op": "add", "number": 15 } }, "expected": 0 },
]

pc.exec(expA);
console.log(pc.cleanup());