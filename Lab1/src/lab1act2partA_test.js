/**
 * SER 421 Lab 1
 * Acitivity 2: JS Programming Part A Test
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.09
 * 
 */
// import { calc, exec, cleanup } from "./lab1act2partA.js";

// Testing file.
console.log("TESTING calc() ---------------------------\n");

console.log(calc('{"op" : "add", "number" : 0}'));          // 0
console.log(calc('{"op" : "add", "number" : -1}'));         // -1
console.log(calc('{"op" : "subtract", "number" : -1}'));    // 0
console.log(calc('{"op" : "add", "number" : 5}'));          // 5
console.log(calc('{"op" : "subtract", "number" : 2}'));     // 3
console.log(calc('{"op" : "add", "number" : 19}'));         // 22
console.log(calc('{"op" : "subtract", "number" : 25}'));    // -3
console.log(calc('{"op" : "add", "number" : 10}'));         // 7
console.log(cleanup());

console.log("\n");

console.log("TESTING exec() ---------------------------\n");
let expA = [
    { "exp": { "op": "add", "number": 0 }, "expected": 0 },
    { "exp": { "op": "add", "number": -1 }, "expected": -1 },
    { "exp": { "op": "subtract", "number": -1 }, "expected": 0 },
    { "exp": { "op": "add", "number": 5 }, "expected": 5 },
    { "exp": { "op": "subtract", "number": 10 }, "expected": -5 },
    { "exp": { "op": "add", "number": 15 }, "expected": 10 }
]

exec(expA);
