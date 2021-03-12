/**
 * SER 421 Lab 1
 * Acitivity 2: JS Programming Part B Test
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.10
 * 
 */
import { calc, exec, cleanup } from "./lab1act2partB.js";

console.log("TESTING Part B calc() ---------------------------\n");

console.log(calc('{"op" : "add", "number" : 5}'));          // 5
console.log(calc('{"op" : "subtract", "number" : 2}'));     // 3
console.log(calc('{"op" : "add", "number" : 19}'));         // 22
// nested expressions
console.log(calc('{"op": "subtract", "expr" : {"op" : "add", "number" : 15}}'));    // 0
console.log(calc('{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 3}}}')); // -12
console.log(calc('{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "add", "number" : 6}}}')); // -24
console.log(calc('{"op": "add", "expr" : {"op" : "subtract", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 1}}}}')); // 0

console.log(cleanup());
console.log("\n");

console.log("TESTING Part B exec() ---------------------------\n");

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

exec(expA);
console.log(cleanup());
