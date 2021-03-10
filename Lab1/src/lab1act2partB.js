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
// console.log(calc('{"op": "add", "expr" : {"op" : "add", "expr" : {"op" : "subtract", "number" : 3}}}'));
function calc(String) {
    let calc = JSON.parse(String);

    //if nested expressions, get nested array op
    if(calc.expr) {
        let op = []
        op.push(calc.op);

        while(calc.expr) {
            console.log(calc.expr);
        }
    } else {
        result = doMaths(calc);
    }
    return result;

};

function doMaths(calcString) {
    let maths = calcString;
    // console.log(calcString);

    if (maths.op === "add") {
        result += maths.number;
    }
    else if (maths.op === "subtract") {
        result -= maths.number;

    } else {
        console.log("Check JSON string. Only add and subtract are supported.");
    }
    return result;
};


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
