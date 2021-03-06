// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

import { writeFile } from 'fs';

var config = {
    maxFiles: 20,
    maxConnections: 15,
    rootPath: "/webroot"
};

var configTxt = JSON.stringify(config);
var options = { encoding: 'utf8', flag: 'w' };

writeFile('./data/config.txt', configTxt, options, function (err) { //async bc callback present
    if (err) {
        console.log("Config Write Failed.");
    } else {
        console.log("Config Saved.");
    }
});

