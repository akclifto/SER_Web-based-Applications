// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development
import { openSync, readSync, closeSync } from 'fs';  // fs = file system

let fd = openSync('./data/veggie.txt', 'r');
var veggies = "";
do {
  var buf = new Buffer.alloc(5); //buf alloc 5 bytes.
  buf.fill();
  var bytes = readSync(fd, buf, null, 5); //reads 5 bytes at a time and blocks any IO while its reading
  console.log("read %d bytes", bytes); 
  veggies += buf.toString();  // buf adds whatever is read to the veggies var.
} while (bytes > 0); //  do-while until out of bytes to read.
closeSync(fd); // close sync file
console.log("Veggies: " + veggies);
