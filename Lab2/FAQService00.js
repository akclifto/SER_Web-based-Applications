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
import { parse as qstringParse } from 'querystring';
import path from 'path';

const __dirname = path.resolve();
const port = process.env.PORT || 3000;

/**
 * Class to hold a fake database for username and password lookup on login.
 */
class fakeDataBase {

    constructor() {

        this.db = [
        {
            "username": "inst",
            "password": "1234",
        },
        {
            "username": "stu",
            "password": "asdf",
        }
        ];
    }
}

const database = new fakeDataBase();
console.log(database);
/**
 * Method to create server.
 * @param {*} req : incoming request
 * @param {*} res : server response
 */
createServer((req, res) => {

    let urlObj = parse(req.url, true, false);
    let path = urlObj.path;
    //check simplewebproxy.js in webproxy folder for ref
    if (req.method === "GET") {
        routePath(path, res);
    } 
    else if (req.method === "POST") {
        // httpserverExternal.js ref
        let reqData = "";
        req.on("data", function (chunk) {
            reqData += chunk;
        });
        req.on('end', function () {
            //name values from form input types are getting passed in postParams
            let postParams = qstringParse(reqData);
            getResponse(path, postParams, res);
        });
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
        // console.log("loading default url => get request");
        console.log("\"/\" page.  Redirect to login page.")
        path = "/login";
        res.writeHead(300);
        routePath(path, res);
    }
    else if (path === "/login") {
        setPage(path, res);
    }
    else if (path === "/home") {
        setPage(path, res);
    }
    else {
        console.log("Hit the 404 page.")
        path = "/pageNotFound";
        setPage(path, res);

    }
}

/**
 * Method to set html pages.
 * @param {*} page : page to set
 * @param {*} res : server response.
 */
function setPage(page, res) {

    try {
        console.log("set page: " + page);
        readFile(__dirname + "/Lab2/html" + page + ".html", function (err, content) {
            //check error
            if (err) {
                res.writeHead(400, { "content-type": "application/json" });
                res.end(err);
            }
            //check 404
            else if (page === "/pageNotFound") {
                res.writeHead(404, { "content-type": "text/html" });
                res.end(content);
            }
            //set page
            else {
                res.writeHead(200, { "content-type": "text/html" });
                res.end(content);
            }
        });
    } catch (err) {
        console.log("Error setPage: ", err);
    }
}

function getResponse(path, postParams, res) {
    //TODO post request response here.
    console.log("hit the POST REQUEST.");
    console.log("postParams:\n\n", postParams);
    console.log("path:  ", path);
    res.end();

    


}
