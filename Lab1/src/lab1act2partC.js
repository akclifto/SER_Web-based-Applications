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
        // console.log(pc.calc('{"op" : "push", "expr" : {"op" : "add", "expr": {"op" : "pop"}}}'));
        console.log(op);
        for (let i in op) {
            // console.log(this.print());
            if (op[i] === "add") {
                result += lastExpression.number;
                lastExpression.number = result;
            }
            else if (op[i] === "subtract") {
                result -= lastExpression.number;
                lastExpression.number = result;
            }
            else if (op[i] === "push") {
                console.log("hit push");
                // console.log("push " + lastExpression.number + " to " + stack);
                console.log("lastExpression number pre push: ", lastExpression.number);
                this.push(lastExpression.number);
                lastExpression.number = result;
                console.log("lastExpression number: ", lastExpression.number);
            }
            else if (op[i] === "pop") {
                console.log("hit pop");
                result = this.pop();
                console.log("Item popped: ", result);
                if (result === undefined || result === NaN) {
                    return this.getEmptyStackMessage();
                }

            }
            else if (op[i] === "print") {
                console.log("hit print");
                this.print();
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
    return "[" + this.calcStack.toString() + "]";
};

PreCalc.prototype.doMaths = function (maths) {
    let res;
    if (maths.op === "add") {
        this.result += maths.number;
    }
    else if (maths.op === "subtract") {
        this.result -= maths.number;
    }
    else if (maths.op === "push") {
        this.push(maths.number);
        return maths.number;
    }
    else if (maths.op === "pop") {
        res = this.pop();
        if (res === undefined || res === NaN) {
            return this.getEmptyStackMessage();
        }
        return res;
    }
    else if (maths.op === "print") {
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

PreCalc.prototype.getEmptyStackMessage = function () {
    return "The Stack is now empty. No items left.\n";
}

export default PreCalc;
