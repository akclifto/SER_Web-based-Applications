// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development
import { Readable } from 'stream';
import { inherits } from 'util';

inherits(Answers, Readable);

function Answers(opt) {
    Readable.call(this, opt);
    this.quotes = ["yes", "no", "maybe"];
    this._index = 0;
}

Answers.prototype._read = function () {
    if (this._index > this.quotes.length) {
        this.push(null);
    } else {
        this.push(this.quotes[this._index]);
        this._index += 1;
    }
};

var r = new Answers();
console.log("Direct read: " + r.read().toString());

r.on('data', function (data) {
    console.log("Callback read: " + data.toString());
});

r.on('end', function () {
    console.log("No more answers.");
});

