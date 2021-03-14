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
import { parse } from 'url';

const port = process.env.PORT || 3000;

//create server
createServer((req, res) => {

    //check simplewebproxy.js in webproxy folder
    if (req.method === "GET") {
        let urlObj = parse(req.url, true, false);
        let path = urlObj.path;
        clientGETRequest(path, res);
    } else if (req.method === "POST") {

        let contentType = req.headers["content-type"];
        let path = parse(req.url, true, false).path;
        clientPOSTRequest(path, res, contentType)
    }

}).listen(port, () => {
    console.log("Server started. Listening on port: " + port);
});


function clientGETRequest(path, res) {
    
    if (path === "/") {

        console.log("loading default url is a get request");
        // setPage("/", res);
        res.writeHead(200, { "content-type": "application/json" });
        res.end("Static server is up.  Will be the LOGIN page.");

    } else if (path === "/home") {

        console.log("/home accessed, this will be the main page");
        res.writeHead(200, { "content-type": "application/json" });
        res.end("HOME page: will be the View Q&A Page, dynamic based on user login for functionality.");

    } else {

        console.log("Hit the 404 page")
        res.writeHead(404, { "content-type": "application/json" });
        res.end("404! Page not found: Do something to link back to home page.");

    }
}

// function setPage(page, res){
    
//     try {
//         res.writeHead(400, { "contentType": "application/json"});


//     } catch (err) {
//         console.log("Error setPage: ", err);
//         let error = JSON.stringify(err);
//         res.writeHead(400, { "contentType": "application/json"});
//         res.end(error);
//     }

// }

function clientPOSTRequest(path, res, contentType) {
    //TODO post request response here.
}
