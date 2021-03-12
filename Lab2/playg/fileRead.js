// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

import { readFile } from 'fs';

var options = {encoding:'utf8', flag:'r'};
// just reads the entire file, async callback, should prolly set limits
readFile('./data/config.txt', options, function(err, data){  
  if (err){
    console.log("Failed to open Config File.");
  } else {
    console.log("Config Loaded.");
    var config = JSON.parse(data);
    console.log("Max Files: " + config.maxFiles);
    console.log("Max Connections: " + config.maxConnections);
    console.log("Root Path: " + config.rootPath);
  }
});
