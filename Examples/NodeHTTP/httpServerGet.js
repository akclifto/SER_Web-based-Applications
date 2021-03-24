// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

import { createServer } from 'http';
import { parse } from 'url';
var messages = ['Hello World', 'From a Node.js server', 'Take Luck'];

createServer(function (req, res) {
    let resBody = '';
    let resMsg = '';
    // This way of parsing a query string is deprecated but I still find it much easier
    // than trying to use the new WhatWG URL object and trying to parse the searchParams
    let urlObj = parse(req.url, true, false); //deprecated --> returns url string
    // const baseURL = "http://" + req.headers.host + "/";
    // let urlObj = new URL(req.url, baseURL);
    let qstr = urlObj.query; // this is the ? in url query
    console.log(qstr);
    if (!qstr.msg) {
        resMsg = '<h2>No msg parameter</h2>\n';
    } else {
        resMsg = '<h1>'+messages[qstr.msg]+'</h2>'; // here specifies the msg in url ...?msg=0, 1, 2
    }
    resBody = resBody + '<html><head><title>Simple HTTP Server</title></head>';
    resBody = resBody + '<body>' + resMsg;
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(resBody + '\n</body></html>');
}).listen(8088);

/**
 * Going to the page gives 'no msg parameter'. at localhost:8080
 * 
 * Try localhost:8080?msg=foo
 *      gives 'undefined' message, because 'foo' isn't an index in var messages above.
 * 
 * Try localhost:8080?msg=0
 *      gives 'Hello World'
 * 
 * Try localhost:8080?msg=1
 *      gives 'From a Node.js server'
 * 
 * Try localhost:8080?msg=2
 *      gives 'Take Luck'
 * 
 * Try localhost:8080?msg=3
 *      gives 'undefined' again bc not valid index in var messages.
 */
