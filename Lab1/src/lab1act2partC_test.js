/**
 * SER 421 Lab 1
 * Acitivity 2: JS Programming Part C Test
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.10
 * 
 */
import PreCalc from "./lab1act2partC.js";

let pc = new PreCalc(0);

 console.log("TESTING Part B calc() ---------------------------\n");

 console.log(pc.calc('{"op" : "add", "number" : 5}'));          // 5
//  console.log(calc('{"op" : "subtract", "number" : 2}'));     // 3
//  console.log(calc('{"op" : "add", "number" : 19}'));         // 22
//  // nested expressions
//  console.log(calc('{"op": "subtract", "expr" : {"op" : "add", "number" : 15}}'));    // 0
//  console.log(calc('{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 3}}}')); // -12
//  console.log(calc('{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "add", "number" : 6}}}')); // -24
//  console.log(calc('{"op": "add", "expr" : {"op" : "subtract", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 1}}}}')); // 0
 
//  console.log(cleanup());
 console.log("\n");