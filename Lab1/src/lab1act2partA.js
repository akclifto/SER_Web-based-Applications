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
    let calc = JSON.parse(String);

    if (calc.op === "add") {
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
    console.log("exec(array) called. Array length: " + array.length);

    // JSON.stringify() for object array
    for (let i in array) {

        let op = JSON.stringify(array[i].exp);
        result = calc(op);
        console.log(result + " = " + array[i].expected);
    }
    return 0;

};

function cleanup() {
    result = 0;
    return "Calc() results reset to: " + result;
};


export { calc, exec, cleanup };