/**
 * SER 421 Lab 1
 * Acitivity 2: JS Programming Part B
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.09
 * 
 */

let result = 0;

// console.log(calc('{"op": "subtract", "expr" : {"op" : "add", "number" : 15}}'));
function calc(String) {
    let calc = JSON.parse(String);

    //if nested expressions

    //else single expression
    if (calc.op === "add") {
        result += calc.number;
    }
    else if (calc.op === "subtract") {
        result -= calc.number;

    } else {
        console.log("Check JSON string input. Only add and subtract are supported.");
    }
    return result;
}

function exec(array) {

    // JSON.stringify() for object array
    for (let i in array) {

        let op = JSON.stringify(array[i].exp);
        result = calc(op);
        console.log(result + " = " + array[i].expected);
    }
    return "exec() complete."
};

function cleanup() {
    result = 0;
    return "result reset to: " + result;
};


export { calc, exec, cleanup };
