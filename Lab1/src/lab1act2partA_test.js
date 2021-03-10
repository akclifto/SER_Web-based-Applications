/**
 * SER 421 Lab 1
 * Acitivity 2: JS Programming Part A Test
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.09
 * 
 */
import { calc, exec } from "./lab1act2partA.js";

// Testing file.
console.log("test file ------------------ ");

console.log(calc('{"op" : "add", "number" : 5}')); //5
console.log(calc('{"op" : "subtract", "number" : 2}')); // 3
console.log(calc('{"op" : "add", "number" : 19}')); // 22

let array = new Array(10);
exec(array);
