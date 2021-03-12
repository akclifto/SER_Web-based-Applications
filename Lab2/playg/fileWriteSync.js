// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

import { openSync, writeSync, closeSync } from 'fs';

var veggieTray = ['carrots', 'celery', 'olives'];
let fd = openSync('./data/veggie.txt', 'w');

while (veggieTray.length) {
    let veggie = veggieTray.pop() + " ";
    var bytes = writeSync(fd, veggie, null, null);
    console.log("Wrote %s %d bytes", veggie, bytes);
}

closeSync(fd);
