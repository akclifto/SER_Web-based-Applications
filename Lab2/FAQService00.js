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
// import { parse } from 'url';
import { parse as qstringParse } from 'querystring';
import path from 'path';

// const __dirname = path.resolve();
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

    //check simplewebproxy.js in webproxy folder for ref
    if (req.method === "GET") {
        routePath(req, res);
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
            routePath(path, postData, req, res);
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
function routePath(req, res) {

    if (req.url === "/") {
        // console.log("loading default url => get request");
        console.log("\"/\" page.  Redirect to login page.")
        req.url = "/login";
        routePath(req, res);
    }
    else if (req.url === "/login") {
        login(req, res);
        // setPage(req.url, res);
    }
    else if (req.url === "/instructor") {
        //TODO
    }
    else if(req.url === "/student") {
        //TODO
    } 
    else {
        console.log("Hit the 404 page.")
        req.url = "/pageNotFound";
        // setPage(path, res); 
    }

        // let check = checkLogin(postData);
        // console.log("check val: ", check);
        // if (check === 401) {
        //     let page =
        //         "<html><head><title></title></head>" +
        //         "<body>" +
        //         "<p>You must login first.</p> " +
        //         "<a href=\"/\"> Return to Login </a>" +
        //         "</body></html>"
        //     res.writeHead(401, { "content-type": "text/html" });
        //     res.end(page);
        // }
        // else if (check === 200) {
        //     //TODO: need to set some cookies for login persistence
        //     setPage(path, res);
        // } else {
        //     let page =
        //         "<html><head><title></title></head>" +
        //         "<body>" +
        //         "<p>Invalid username/password combination.</p> " +
        //         "<a href=\"/\"> Return to Login </a>" +
        //         "</body></html>"
        //     res.writeHead(403, { "content-type": "text/html" });
        //     res.end(page);
        // }
    // }
    // else {
    //     console.log("Hit the 404 page.")
    //     path = "/pageNotFound";
    //     setPage(path, res);

    // }
}


function login(req, res) {
    // console.log("setting login page");
    res.writeHead(200, { "content-type": "text/html" });
    readFile('./Lab2/html/login.html', function(err, content) {
        
        if(err) {
            console.log("login error: " + err);
            throw(err);
        }
        res.write(content);
        res.end();
    });
}

/**
 * Method to set html pages.
 * @param {*} page : page to set
 * @param {*} res : server response.
 */
// function setPage(page, res) {

//     try {
//         console.log("set page: " + page);
//         readFile("./html" + page + ".html", function (err, content) {
//             //check error
//             if (err) {
//                 res.writeHead(400, { "content-type": "application/json" });
//                 res.end(err);
//             }
//             //check 404
//             else if (page === "/pageNotFound") {
//                 res.writeHead(404, { "content-type": "text/html" });
//                 res.end(content);
//             }
//             //set page
//             else {
//                 res.writeHead(200, { "content-type": "text/html" });
//                 res.end(content);
//             }
//         });
//     } catch (err) {
//         console.log("Error setPage: ", err);
//     }
// }

/**
 * Method to check user login.  Validates login credentials.
 * @param {*} postData : user post info
 * @param {*} res : server response
 * @returns 200 if login validates, 402 otherwise.
 */
function checkLogin(postData) {

    //check page access
    const check = checkAuthorization(postData);
    if(check === 401) {
        return 401;
    }

    // check login validation
    for (let i in fake.db) {
        // console.log(fake.db[i]);

        if (postData.username === fake.db[i].username &&
            postData.password == fake.db[i].password &&
            postData.role == fake.db[i].role) {
            // console.log("user and login match");
            // setRole(req, res, )
            return 200;
        }
    }
    // console.log("login didn't match");
    return 403;
}

/**
 * Method to check authorization; checks unauthorized page access.
 * @param {*} postParams : login parameters from user
 * @returns 401 if invalid, 200 if valid.
 */
function checkAuthorization (postData) {

    // TODO: will need to precheck cookies here to skip subseq logins. 
    // use diff status code to bypass rest of login check in checkLogin().

    console.log(postData);
    // check if the user tried to access a protected page
    if (postData.username === undefined ||
        postData.password === undefined ||
        postData.role === undefined) {
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