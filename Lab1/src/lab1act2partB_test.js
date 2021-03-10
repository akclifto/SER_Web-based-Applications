/**
 * SER 421 Lab 1
 * Acitivity 2: JS Programming Part B Test
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.09
 * 
 */
import { calc, exec, cleanup } from "./lab1act2partB.js";

console.log("TESTING Part B calc() ---------------------------\n");

console.log(calc('{"op" : "add", "number" : 5}'));          // 5
console.log(calc('{"op" : "subtract", "number" : 2}'));     // 3
console.log(calc('{"op" : "add", "number" : 19}'));         // 22
//nested expressions
console.log(calc('{"op": "subtract", "expr" : {"op" : "add", "number" : 15}}'));    // 0
console.log(calc('{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 3}}}')); // -12