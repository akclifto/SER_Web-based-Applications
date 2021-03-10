/**
 * SER 421 Lab 1
 * Acitivity 2: JS Programming Part A
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.09
 * 
 */
let result = 0;

function calc(String) {
    let  calc = JSON.parse(String);

    if(calc.op === "add" ) {
        // console.log("add");
        result += calc.number;
    } 
    else if (calc.op === "subtract") {
        // console.log("subtract");
        result -= calc.number;

    } else {
        console.log("some default");
    }
    return result;
};

function exec(array) {
    console.log("exec(array) called.");
};

console.log(calc('{"op" : "add", "number" : 5}')); //5
console.log(calc('{"op" : "subtract", "number" : 2}')); // 3
console.log(calc('{"op" : "add", "number" : 19}')); // 22

export { calc, exec };