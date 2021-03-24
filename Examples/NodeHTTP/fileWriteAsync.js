// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

import { write, close, open } from 'fs';

var fruitBowl = ['apple', 'orange', 'banana', 'grapes'];

function writeFruit(fd) {
    if (fruitBowl.length) {
        var fruit = fruitBowl.pop() + " ";
        write(fd, fruit, null, null, function (err, bytes) {
            if (err) {
                console.log("File Write Failed.");
            } else {
                console.log("Wrote: %s %d bytes", fruit, bytes);
                writeFruit(fd);
            }
        });
    } else {
        close(fd, (err1) => {
            if (err1) throw err1;
        });
    }
}
open('./data/fruit.txt', 'w', function (err, fd) {
    writeFruit(fd);
});
