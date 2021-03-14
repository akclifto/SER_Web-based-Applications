/**
 * SER 421 Lab 2
 * Acitivity 2: Implement Simple FAQ Service
 * @author Adam Clifton
 * @email akclifto@asu.edu 
 * @date 2021.03.13
 * 
 * See Lab2_ReadMe.txt for information.
 * 
 */
import { createServer } from 'http';
const port = process.env.PORT || 3000;

//create server
createServer( function (req, res) {
    
    res.writeHead(200, {"content-type": "application/json"});
    res.end("Static server is up.");

}).listen(port, () => {
    console.log("Server started. Listening on port: " + port);
});