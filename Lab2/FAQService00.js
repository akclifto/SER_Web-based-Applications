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
import { parse as qstringParse } from 'querystring';

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

        if (req.url === "/") {
            processFormData(req, res, function (formData) {
                //check logout
                // console.log(formData.logout);
                if (formData.logout) {
                    logout(req, res, function (content) {
                        res.write(content);
                        res.end();
                    });
                }
            });
        }
        else {
            routePath(req, res);
        }

        if (req.url === "/home") {
            // get user form data for login
            processFormData(req, res, function (formData) {

                // console.log(formData);
                let check = checkLogin(formData);
                // should never get flagged here, but if does, will catch
                if (check === 401) {
                    unAuthorizedAccess(res);
                }
                else if (check === 403) {
                    loginInvalid(res);
                }
                // login is valid, get userRole, set appropriate login
                else if (check == 200 && formData.role !== undefined) {
                    homePage(req, res, formData);
                }
                else {
                    loginInvalid(res);
                }
            });
        }
    }

}).listen(port, () => {
    console.log("Server started. Listening on port: " + port);
});

/**
 * Method to set homePage based on user login. Sets up instructor and student.
 * @param {*} req : user request
 * @param {*} res : server response
 * @param {*} formData : formData from login input
 */
function homePage(req, res, formData) {

    console.log("setting home page by role");
    let user = "username=" + formData.username;
    let role = "role=" + formData.role;
    let cookie = [user, role];

    // console.log(role);    
    if (role === "instructor") {
        res.writeHead(200, {
            "location": "/instructor",
            "content-type": "text/html",
            "set-cookie": cookie[0] + " ;" + cookie[1], // user ; role 
        });
        console.log("homePage cookie: ", cookie);
    } else {
        res.writeHead(200, {
            "location": "/student",
            "content-type": "text/html",
            "set-cookie": cookie[0] + " ;" + cookie[1], // user ; role
        });
        console.log("homePage cookie: ", cookie);
    }
    readFile("./Lab2/html/home.html", function (err, content) {
        if (err) {
            console.log("homePage error: ", err);
        }
        // console.log("cookie: ", cookie);
        // for some reason, have to replace each instance of {username} hence 1 and 2 appended.
        content = content.toString().replace('{username1}', formData.username);
        content = content.toString().replace('{username2}', formData.username);
        content = content.toString().replace('{role}', formData.role);
        res.write(content);
        res.end();
    });
}

/**
 * Method to get form data input. Check http_server_external.js class example.
 * @param {*} req : user request
 * @param {*} res : server response
 * @param {*} resultFunc : result callback containing user post data input.
 */
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
    console.log("no login match match");
    return 403;
}

/**
 * Method to check authorization; checks unauthorized page access.
 * @param {*} postParams : login parameters from user
 * @returns 401 if invalid, 200 if valid.
 */
function checkAuthorization(postData) {

    // console.log(postData);
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
        let cookie = req.headers.cookie; // holders user cookie
        console.log("logout cookie: ", cookie);
        loginPage(req, res);
    }
    else if (req.url === "/instructor") {
        processFormData(req, res, function (formData) {
            // console.log(formData);
            let check = checkLogin(formData);
            console.log(check);
            if (check === 401) {
                unAuthorizedAccess(res);
            } else {
                homePage(req, res);
            }
        });
    }
    else if (req.url === "/student") {
        processFormData(req, res, function (formData) {
            // console.log(formData);
            let check = checkLogin(formData);
            if (check === 401) {
                unAuthorizedAccess(res);
            } else {
                homePage(req, res);
            }
        });
    }
    else if (req.url === "/home") {
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

        if (req.headers.cookie) {
            let name = req.headers.cookie;
            name = name.split("=");
            // console.log(name[1]);
            const greeting = "Welcome back " + name[1] + ", please enter your password.";
            content = content.toString().replace("{login}", greeting);
            content = content.toString().replace("{Username}", name[1]);
            res.write(content);
            res.end();
        } else {
            content = content.toString().replace("{login}", "Login");
            content = content.toString().replace("{Username}", "Username");
            res.write(content);
            res.end();
        }
    });
}

/**
 * Method to logout and redirect to login screen.
 * @param {*} req : user request
 * @param {*} res : server response
 * @param {*} resultFunc : callback function result
 */
function logout(req, res, resultFunc) {
    console.log("logging out...")
    let cookie = req.headers.cookie; // holders user cookie
    console.log("logout cookie: ", cookie);
    res.writeHead(200, { "content-type": "text/html" });
    readFile("./Lab2/html/login.html", function (err, content) {
        if (err) {
            console.log("logout error: ", err);
        }
        let name = req.headers.cookie;
        name = name.split("=");
        content = content.toString().replace("{login}", "You have been logged out.");
        content = content.toString().replace("{Username}", name[1]);
        resultFunc(content);
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

/**
 * Set page for unauthorized access.  Links back to login page.
 * @param {*} res : server response
 */
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
        res.end(content);
    });
}

/**
 * Method to set page for invalid login. Links back to login page.
 * @param {*} res 
 */
function loginInvalid(res) {

    res.writeHead(200, { "content-type": "text/html" });
    readFile("./Lab2/html/login.html", function (err, content) {
        if (err) {
            console.log("loginInvalid error: " + err);
        }
        content = content.toString().replace('{login}', "Invalid username/password combination. Please try again.");
        content = content.toString().replace('{Username}', "Username");
        res.write(content);
        res.end();
    });
}
