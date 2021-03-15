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
// import path from 'path';

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
                "password": "admin",
                "role": "instructor",
            },
            {
                "username": "stu",
                "password": "dent",
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

    //check simplewebproxy.js, cachewebproxy.js in webproxy folder ref
    if (req.method === "GET") {
        routePath(req, res);
    }
    else if (req.method === "POST") {
        if(req.url === "/home") {
            // get user form data for login
            processFormData(req, res, function (formData) {
                // console.log(formData);
                let check = checkLogin(formData);
                // should never get flagged here, but if does, will catch
                if (check === 401) {
                    unAuthorizedAccess(res);
                }
                else if(check === 403) {
                    loginInvalid(res);
                } 
                // login is valid, get userRole, set appropriate login
                let userRole = formData.role;
                console.log("Role: ", userRole);
                if (userRole === "instructor") {
                    instructorHome(req, res, formData, userRole);
                }
                else if (userRole === "student") {
                    studentHome(req, res, formData, userRole);
                } else {
                    loginInvalid(res);
                }
            });
        }
        // console.log(result);
        // req.on('end', function () {
        //name values from form input types are getting passed in postParams
        // let postData = qstringParse(reqData);
        // routePath(path, postData, req, res);
        // getResponse(path, postData, res);
        // });
    }

}).listen(port, () => {
    console.log("Server started. Listening on port: " + port);
});

function processFormData(req, res, resultFunc) {

    // httpserverExternal.js ref
    let reqData = "";
    req.on("data", function (chunk) {
        reqData += chunk;
    });
    req.on("end", function () {
        let postData = qstringParse(reqData);
        resultFunc(postData);
    });
}

/**
 * Method to check user login.  Validates login credentials.
 * @param {*} postData : user post info
 * @param {*} res : server response
 * @returns 200 if login validates, 402 otherwise.
 */
function checkLogin(postData) {

    //check page access
    const check = checkAuthorization(postData);
    if (check === 401) {
        return 401;
    }

    // check login validation
    for (let i in fake.db) {
        // console.log(fake.db[i]);

        if (postData.username === fake.db[i].username &&
            postData.password == fake.db[i].password &&
            postData.role == fake.db[i].role) {
            console.log("user and login match");
            // setRole(req, res, )
            return 200;
        }
    }
    console.log("login didn't match");
    return 403;
}

/**
 * Method to check authorization; checks unauthorized page access.
 * @param {*} postParams : login parameters from user
 * @returns 401 if invalid, 200 if valid.
 */
function checkAuthorization(postData) {

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
        loginPage(req, res);
    }
    else if (req.url === "/instructor") {
        instructorHome(req, res);
    }
    else if (req.url === "/student") {
        studentHome(req, res);
    }
    else if(req.url === "/home") {
        //home has been moved to instructor and student pages.
        // should flag correct unAuth access page here.     
        processFormData(req, res, function (formData) {
            // console.log(formData);
            let check = checkLogin(formData);
            if (check === 401) {
                unAuthorizedAccess(res);
            }
        });       
    }
    else {
        pageNotFound(res);
    }
}

/**
 * Method to set login page, replacing setPage() funct
 * @param {1} req : user request
 * @param {*} res : server response
 */
function loginPage(req, res) {
    // console.log("setting login page");
    res.writeHead(200, { "content-type": "text/html" });
    readFile('./Lab2/html/login.html', function (err, content) {

        if (err) {
            console.log("login error: " + err);
        }
        res.write(content);
        res.end();
    });
}

/**
 * Method to set instructor home page, replacing setPage() funct
 * @param {1} req : user request
 * @param {*} res : server response
 */
function instructorHome(req, res, formData, userRole) {
    console.log("setting instructor home page");
    let user = "username=" + formData.username;
    let role = "role=" + userRole.toString();
    // console.log(role);    
    let cookie = [ user, role];
    res.writeHead(200, { 
        "content-type": "text/html",
        "set-cookie": cookie[0] + " ;" + cookie[1], // user ; role
    });
    readFile("./Lab2/html/home.html", function(err, content) {
        if(err){
            console.log("instructorHome error: ", err);
        }
        console.log("cookie: ", cookie);
        // for some reason, have to replace each instance of {username} hence 1 and 2 appended.
        content = content.toString().replace('{username1}', formData.username);
        content = content.toString().replace('{username2}', formData.username);
        content = content.toString().replace('{role}', formData.role);
        res.write(content);
        res.end();
    });
}

/**
 * Method to set student home page, replacing setPage() funct
 * @param {1} req : user request
 * @param {*} res : server response
 */
function studentHome(req, res, formData, userRole) {
    console.log("setting student home page");
    let user = "username=" + formData.username;
    let role = "role=" + userRole.toString();
    // console.log(role);    
    let cookie = [ user, role];
    res.writeHead(200, { 
        "content-type": "text/html",
        "set-cookie": cookie[0] + " ;" + cookie[1], // user ; role
    });
    readFile("./Lab2/html/home.html", function(err, content) {
        if(err){
            console.log("studentHome error: ", err);
        }
        console.log("cookie: ", cookie);
        // for some reason, have to replace each instance of {username} hence 1 and 2 appended.
        content = content.toString().replace('{username1}', formData.username);
        content = content.toString().replace('{username2}', formData.username);
        content = content.toString().replace('{role}', formData.role);
        res.write(content);
        res.end();
    });
}

/**
 * Method to set pageNotFound page, replacing setPage() funct
 * @param {1} req : user request
 * @param {*} res : server response
 */
function pageNotFound(res) {
    console.log("Hit the 404 page.")
    res.writeHead(404, { "content-type": "text/html" });
    readFile("./Lab2/html/pageNotFound.html", function (err, content) {

        if (err) {
            console.log("pageNotFound error: " + err);
        }
        res.write(content);
        res.end();
    });
}

function unAuthorizedAccess(res) {
    // res.writeHead(200, { "content-type": "text/html" });
    readFile("./Lab2/html/login.html", function (err, content) {
        if (err) {
            console.log("unAuthorizedAccess error: " + err);
        }
        let page =
            "<html><head><title></title></head>" +
            "<body>" +
            "<p>You do not have permission to view this page. You must login first!</p> " +
            "<a href=\"/\"> Return to Login </a>" +
            "</body></html>"
        content = page;
        // res.write();
        res.end(content);
    });
}

function loginInvalid(res) {
    res.writeHead(200, { "content-type": "text/html" });
    readFile("./Lab2/html/login.html", function (err, content) {
        if (err) {
            console.log("loginInvalid error: " + err);
        }
        let page =
            "<html><head><title></title></head>" +
            "<body>" +
            "<p>Invalid username/password combination.</p> " +
            "<a href=\"/\"> Return to Login </a>" +
            "</body></html>"
        content = page;
        res.write(content);
        res.end();
    });
}
