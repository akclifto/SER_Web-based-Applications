/**
 * SER 421 Lab 1
 * Acitivity 2: JS Programming Part B
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.10
 * 
 */
let result = 0;

function calc(String) {
    let calc = JSON.parse(String);

    // if nested expressions, get nested array op and put in array
    if (calc.expr) {

        let op = []
        let lastExpression = calc;
        let nextExpression = calc.expr;
        // console.log("last expression", lastExpression);
        // console.log("next expression", nextExpression);

        op.unshift(calc.op);

        while (nextExpression) {
            lastExpression = nextExpression;
            op.unshift(lastExpression.op); // move the nested expression to front of array.
            nextExpression = nextExpression.expr //shift to next nested expression.
        }
        // console.log(op);
        for (let i in op) {
            // console.log("last expression number: ", lastExpression.number);
            if (op[i] === "add") {
                // console.log("add " + lastExpression.number + " to " + result);
                result += lastExpression.number;
                // console.log("add result: ", result);
                lastExpression.number = result;
            }
            else if (op[i] === "subtract") {
                // console.log("subtract " + lastExpression.number + " to " + result);
                result -= lastExpression.number;
                // console.log("subtract result: ", result);
                lastExpression.number = result;
            }
            else {
                getErrorMessage();
            }
        }
    } else {
        result = doMaths(calc);
    }
    return result;

};

// part A calc() function
function doMaths(maths) {

    if (maths.op === "add") {
        result += maths.number;
    }
    else if (maths.op === "subtract") {
        result -= maths.number;

    } else {
        getErrorMessage();
    }
    return result;
};

// Unchanged exec() from part A
function exec(array) {

    // JSON.stringify() for object array
    for (let i in array) {

        let op = JSON.stringify(array[i].exp);
        result = calc(op);
        console.log(result + " = " + array[i].expected);
    }
    return "exec() complete."
};

// unchanged cleanup() from part A
function cleanup() {
    result = 0;
    return "result reset to: " + result;
};

// get Message if problem with JSON format or operation calls.
function getErrorMessage() {
    return "Check JSON string. Only add and subtract are supported.";
}

// export { calc, exec, cleanup };
