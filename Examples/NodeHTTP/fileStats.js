// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

import { stat } from 'fs';

stat('fileStats.js', function (err, stats) {
  if (!err){
    console.log('stats: ' + JSON.stringify(stats, null, '  '));
    console.log(stats.isFile() ? "Is a File" : "Is not a File");
    console.log(stats.isDirectory() ? "Is a Folder" : "Is not a Folder");
    console.log(stats.isSocket() ? "Is a Socket" : "Is not a Socket");
    stats.isDirectory();
    stats.isBlockDevice();
    stats.isCharacterDevice();
    //stats.isSymbolicLink(); //only lstat
    stats.isFIFO();
    stats.isSocket();
  }
});
