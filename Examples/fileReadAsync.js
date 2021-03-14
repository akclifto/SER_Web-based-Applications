// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

import { read, close, open } from 'fs';

// async version, note read() has the nested function callback
// async is preferred because node is single threaded.  Blocking others for sync is considered 'not well-behaved'
// done use async and sync at the same time.  Causes too many problems, pick one.

function readFruit(fd, fruits) {
    var buf = new Buffer.alloc(5);
    buf.fill();

    // params (file descriptor, data buffer(5), offset(when to stop [at 0]), length of bytes to read, position (null), callback functions async )
    read(fd, buf, 0, 5, null, function (err, bytes, data) { 

        if (bytes > 0) {
            console.log("read %dbytes", bytes);
            fruits += data;
            readFruit(fd, fruits);  //recursive call here gets rid of do-while loop
        } else {
            close(fd, (err) => {
                if (err) throw err;
            });
            console.log("Fruits: %s", fruits);
        }
    });
}

// here is the entry point. opens file, nests readFruit function
open('./data/fruit.txt', 'r', function (err, fd) { // open, 'r'= read, function callback async
    readFruit(fd, "");
});
