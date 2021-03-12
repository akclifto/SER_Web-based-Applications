// Example from Brad Dayley
// https://github.com/bwdbooks/nodejs-mongodb-angularjs-web-development

// Access http://localhost:8080/hello.html
// serves html file in html folder in playg, change the path name above to see what the error looks like.
import { readFile } from 'fs';
import { createServer } from 'http';
// import { parse } from 'url'; // parse deprecated

// parse has been deprecated, use baseURL like below then urlObj = new URL() like below to get object info.
var ROOT_DIR = "html/";
createServer(function (req, res) {
    // var urlObj = parse(req.url, true, false); // deprecated
    const baseURL = 'http://' + req.headers.host + '/';
    const urlObj = new URL(req.url, baseURL);
    console.log(urlObj);
  readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200, {
	'Content-Type': 'text/html',
        'Set-Cookie': 'foo=bar'
    });
    res.end(data);
  });
}).listen(8080, 'localhost', 3, function() { 
                console.log('I am now ready!'); 
});
