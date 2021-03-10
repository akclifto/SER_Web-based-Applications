/**
 * SER 421 Lab 1
 * Acitivity 2: JS Programming Part C
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.10
 * 
 */

class PreCalc {
    constructor(number) {
        this.calcStack = [number];
        this.result = 0;
    };
};

PreCalc.prototype.calc = function (String) {

    // let calcStack = this.calcStack;
    let result = this.calcStack[0];

    let calc = JSON.parse(String);
    if (calc.expr) {

        let op = []
        let lastExpression = calc;
        let nextExpression = calc.expr;

        op.unshift(calc.op);

        while (nextExpression) {
            lastExpression = nextExpression;
            op.unshift(lastExpression.op); 
            nextExpression = nextExpression.expr 
        }

        for (let i in op) {
            if (op[i] === "add") {
                result += lastExpression.number;
                lastExpression.number = result;
            }
            else if (op[i] === "subtract") {
                result -= lastExpression.number;
                lastExpression.number = result;
            }
            else if(op[i] === "push"){

            }
            else if(op[i] === "pop"){

            }
            else if(op[i] === "print") {
                
            }
            else {
                console.log(this.getErrorMessage());
            }
        }

    } else {
        result = this.doMaths(calc);
    }

    return result;

};

PreCalc.prototype.push = function (result) {
    // push value to front
    this.calcStack.unshift(result);
};

PreCalc.prototype.pop = function () {
    // remove value in front
    const popped = this.calcStack.shift();
    return popped;
};

PreCalc.prototype.print = function () {
    return "[ " + this.calcStack.toString() + " ]";
};

PreCalc.prototype.doMaths = function (maths) {
    let res;
    if (maths.op === "add") {
        this.result += maths.number;
    }
    else if (maths.op === "subtract") {
        this.result -= maths.number;
    }
    else if(maths.op === "push") {
        this.push(maths.number);
        return maths.number;
    } 
    else if(maths.op === "pop") {
        res = this.pop();
        return res;
    }
    else if(maths.op === "print") {
        return this.print();
    }
    else {
        console.log(this.getErrorMessage());
    }
    return this.result;
};

PreCalc.prototype.exec = function (array) {
    for (let i in array) {
        let op = JSON.stringify(array[i].exp);
        this.result = this.calc(op);
        console.log(this.result + " = " + array[i].expected);
    }
    return "exec() complete."
};

PreCalc.prototype.cleanup = function () {
    this.result = 0;
    return "result reset to: " + this.result;
};

PreCalc.prototype.getErrorMessage = function () {
    return "Check JSON string. Only add and subtract are supported.";
};

export default PreCalc;
