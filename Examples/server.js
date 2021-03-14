import http from 'http';

http.createServer(function(req, res) { //this is an anon callback
    res.writeHead(200, {"content-type": "application/json"}); // status code, body-type
    res.end("Hello World!"); //callback: this is returned when viewing in browser localhost:8080

}).listen(8080); //listen for system event on socket port 8080

console.log("Server started");