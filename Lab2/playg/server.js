import http from 'http';

http.createServer(function(req, res) { //this is an anon callback
    res.writeHead(200, {"content-type": "application/json"});
    res.end("Hello World!");

}).listen(8080); //listen for system event on socket port 8080

console.log("Server started");