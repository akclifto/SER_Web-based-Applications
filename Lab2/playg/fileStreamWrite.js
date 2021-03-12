// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

import { Writable } from 'stream';
import { inherits } from 'util';

// going to convert this one to a class function to show the diff.  FileStreamRead is functions and prototypes.
class Writer {
    constructor(opt) {
        Writable.call(this, opt);
        this.data = new Array();
    }
    _write(data, encoding, callback) {
        this.data.push(data.toString('utf8'));
        console.log("Adding: " + data);
        callback();
    }
}

inherits(Writer, Writable);

var w = new Writer();

for (var i=1; i<=5; i++){  
  w.write("Item" + i, 'utf8');
}

w.end("ItemLast");
console.log(w.data);