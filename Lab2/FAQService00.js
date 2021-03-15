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
                "role": "instructor",
            },
            {
                "username": "stu",
                "password": "asdf",
                "role": "student",
            }];
    }
}

// load up the fake database.
const fake = new fakeDataBase();
// console.log(fake.db);

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
        routePath(path, req, res);
    }
    else if (req.method === "POST") {
        // httpserverExternal.js ref
        let reqData = "";
        req.on("data", function (chunk) {
            reqData += chunk;
        });
        req.on('end', function () {
            //name values from form input types are getting passed in postParams
            let postData = qstringParse(reqData);
            // req.postData = postData;
            routePath(path, postData, res);
            // getResponse(path, postData, res);
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
function routePath(path, req, res) {

    if (path === "/") {
        // console.log("loading default url => get request");
        console.log("\"/\" page.  Redirect to login page.")
        path = "/login";
        res.writeHead(300);
        routePath(path, req, res);
    }
    else if (path === "/login") {
        setPage(path, res);
    }
    else if (path === "/home") {

        let check = checkLogin(req);
        // console.log("check val: ", check);
        if (check === 401) {
            let page =
                "<html><head><title></title></head>" +
                "<body>" +
                "<p>You must login first.</p> " +
                "<a href=\"/\"> Return to Login </a>" +
                "</body></html>"
            res.writeHead(401, { "content-type": "text/html" });
            res.end(page);
        }
        else if (check === 200) {
            //TODO: need to set some cookies for login persistence
            setPage(path, res);
        } else {
            let page =
                "<html><head><title></title></head>" +
                "<body>" +
                "<p>Invalid username/password combination.</p> " +
                "<a href=\"/\"> Return to Login </a>" +
                "</body></html>"
            res.writeHead(403, { "content-type": "text/html" });
            res.end(page);
        }
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

/**
 * Method to check user login.  Validates login credentials.
 * @param {*} postParams : user post info
 * @param {*} res : server response
 * @returns 200 if login validates, 402 otherwise.
 */
function checkLogin(postParams) {

    //check page access
    const check = checkAuthorization(postParams);
    if(check === 401) {
        return 401;
    }

    // check login validation
    for (let i in fake.db) {
        console.log(fake.db[i]);

        if (postParams.username === fake.db[i].username &&
            postParams.password == fake.db[i].password &&
            postParams.role == fake.db[i].role) {
            // console.log("user and login match");
            return 200;
        }
    }
    // console.log("login didn't match");
    return 403;
}

/**
 * Method to check authorization; catches unauthorized page access.
 * @param {*} postParams : login parameters from user
 * @returns 401 if invalid, 200 if valid.
 */
function checkAuthorization (postParams) {

    // TODO: will need to precheck cookies here to skip subseq logins. 
    // use diff status code to bypass rest of login check in checkLogin().

    // console.log(postParams);
    // check if the user tried to access a protected page
    if (postParams.username === undefined ||
        postParams.password === undefined ||
        postParams.role === undefined) {
        return 401;
    } 
    return 200;
}

// function getResponse(path, postData, res) {
//     //TODO post request response here.
//     // console.log("hit the POST REQUEST.");
//     console.log("postData:\n\n", postData);
//     // console.log("path:  ", path);

//     // login in checks
//     if(checkLogin(postData)) {
//         console.log("HERHEHERERE");
//         routePath(path, postData, res);
//     } else {
//         res.writeHead(400, { "content-type": "text/html" });
//         res.end("<html><head> MSG: </head><body>Invalid username/password combination</body></html>");
//     }
// }