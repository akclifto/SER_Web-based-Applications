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
import { readFile } from 'fs';
import { createServer } from 'http';
import { parse } from 'url';
import path from 'path';

const __dirname = path.resolve();

const port = process.env.PORT || 3000;

/**
 * Method to create server.
 * @param {*} req : incoming request
 * @param {*} res : server response
 */
createServer((req, res) => {

    //check simplewebproxy.js in webproxy folder
    if (req.method === "GET") {
        let urlObj = parse(req.url, true, false);
        let path = urlObj.path;
        routePath(path, res);
    } else if (req.method === "POST") {

        let contentType = req.headers["content-type"];
        let path = parse(req.url, true, false).path;
        clientPOSTRequest(path, res, contentType)
    }

}).listen(port, () => {
    console.log("Server started. Listening on port: " + port);
});

/**
 * Method to route url paths.
 * @param {*} path : path to route
 * @param {*} res : server response
 */
function routePath(path, res) {

    if (path === "/") {
        console.log("loading default url => get request");
        console.log("\"/\" page.  redirect to login page.")
        path = "/login";
        res.writeHead(300);
        routePath(path, res);
    }
    else if (path === "/login") {
        setPage(path, res);
    }
    else if (path === "/home") {

        console.log("/home accessed, this will be the main page");
        res.writeHead(200, { "content-type": "application/json" });
        res.end("HOME page: will be the View Q&A Page, dynamic based on user login for functionality.");

    }
    else {

        console.log("Hit the 404 page")
        res.writeHead(404, { "content-type": "application/json" });
        res.end("404! Page not found: Do something to link back to home page.");

    }
}

/**
 * Method to set html pages.
 * @param {*} page : page to set
 * @param {*} res : server response.
 */
function setPage(page, res) {

    try {
        console.log("set page...")
        readFile(__dirname + "/Lab2/html" + page + ".html", function (err, content) {
            if (err) {
                res.writeHead(404, { "content-type": "application/json" });
                res.end(err);
            } else {
                res.writeHead(200, { "content-type": "text/html" });
                res.end(content);
            }
        });
    } catch (err) {
        console.log("Error setPage: ", err);
    }

}

function clientPOSTRequest(path, res, contentType) {
    //TODO post request response here.
}
