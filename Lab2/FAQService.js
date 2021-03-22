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
import FAQ from "./FAQ.js";
import path from 'path';

const __dirname = path.resolve();
const QA_FILE = (__dirname + "/Lab2/QA.json");
const port = process.env.PORT || 3000;
let roleStatus = 0; // 0 for student, 1 for instructor

/**
 * Class to hold a fake database for username and password lookup on login.
 */
class FakeDatabase {
    constructor() {
        this.db = [
            {
                "username": "admin",
                "password": "admin",
                "role": "instructor",
            },
            {
                "username": "stu",
                "password": "stu",
                "role": "student",
            }];
    }
}
// load up the fake database.
const fake = new FakeDatabase();
let displays = [];
/**
 * Method to create server.
 * @param {*} req : incoming request
 * @param {*} res : server response
 */
createServer((req, res) => {
    let faq = new FAQ(QA_FILE);
    //check simplewebproxy.js, cachewebproxy.js in webproxy folder ref
    try {
        if (req.method === "GET") {
            routeGetPaths(req, res);
        }
        else if (req.method === "POST") {
            routePostPaths(req, res, faq);
        }
    } catch (err) {
        console.log("createServer routing error: ", err);
    }

}).listen(port, () => {
    serverLog("Server started. Listening on port: " + port);
});

/**
 * Method to handle GET request path routing
 * @param {*} req : user request
 * @param {*} res : server response
 */
function routeGetPaths(req, res) {
    // console.log("faq: ", faq.dataStore);
    if (req.url == "/home") {

        processFormData(req, res, function (formData) {
            let status = checkLogin(formData);
            if (status === 401) {
                unAuthorizedAccess(res);
            } else {
                routePath(req, res);
            }
        });
    }
    else if (req.url == "/edit" || req.url == "/add") {
        if (findRole() === "student") {
            unAuthorizedAccess(res);
        } else {
            routePath(req, res);
        }
    }
    else {
        routePath(req, res);
    }
}

/**
 * Method to handle POST request path routing.
 * @param {*} req : user request
 * @param {*} res : server response
 * @param {*} faq : faq object containing QA information.
 */
function routePostPaths(req, res, faq) {

    if (req.url === "/") {
        processFormData(req, res, function (formData) {
            
            //check logout
            if (formData.logout) {
                logout(req, res, function (content) {
                    res.write(content);
                    res.end();
                });
            }
        });
        // routePath(req, res);
    }
    if (req.url === "/home") {
        // get user form data for login
        processFormData(req, res, function (formData) {

            if (formData.search) {
                homePage(req, res, formData, faq);
            }
            if(formData.addQASave) {
                addQASave(req, res, formData, faq);

            }
            if (formData.editCancel || formData.addQACancel) {
                setInstructorView(req, res, formData, faq);
            }
            if (formData.login) {
                let status = checkLogin(formData);
                if (status === 401) {
                    unAuthorizedAccess(res);
                }
                else if (status === 403) {
                    loginInvalid(res);
                }
                // login is valid, get userRole, set appropriate login
                else if (status == 200 && formData.role !== undefined) {
                    serverLog("Logging in user " +
                        formData.username + " as " +
                        formData.role);
                    homePage(req, res, formData, faq);
                }
                else {
                    loginInvalid(res);
                }
            }
        });
    }
}

/**
 * Helper method for GET method to route url paths.
 * @param {*} path : path to route
 * @param {*} res : server response
 */
function routePath(req, res) {

    if (req.url === "/") {
        serverLog("\"/\" page.  Redirecting to login page.")
        req.url = "/login";
        routePath(req, res);
    }
    else if (req.url === "/login") {
        loginPage(req, res);
    }
    else if (req.url === "/edit") {
        editPage(req, res);
    }
    else if (req.url === "/add") {
        addPage(req, res);
    }
    else {
        pageNotFound(res);
    }
}

/**
 * Method to displayQAItems
 * @param {*} items 
 * @returns formatted list of QA items to display.
 */
function displayQAItems(items, role) {
    let page = "";

    // Check no filtered results.  
    // If the first item is undefined, all items will be undefined.
    if(items[0].question === undefined) {
        page = "<b>No results from search filter. <b>";
        return page;
    }

    for (let i in items) {
        let each = "";
        //convert date string
        // let date = new Date(items[i].date);

        if (role === "student") {

            each = "<b>" + items[i].question + "</b>\n" +
                items[i].answer + "\n" + 
                "Tags: " + items[i].tags + "\n" +
                items[i].author + "\n" +
                new Date(items[i].date).toDateString() + "\n";
        } else {
            each = "<a href=\"/edit\"><b>" + items[i].question + "</b></a>\n" +
                items[i].answer + "\n" + 
                "Tags: " + items[i].tags + "\n" +
                items[i].author + "\n" +
                new Date(items[i].date).toDateString() + "\n";
            each = each +
                "<form action=\"/home\" method=\"post\"><input type=\"submit\" " +
                " value=\"Delete\" name=\"delete\" id=\"delete\" ></form>\n";
        }
        page = page.concat(each).concat("\n");
        // TODO: think I will need this for list manip since everything is being rendered as a string.
        displays.push(items[i]);
    }
    // console.log(page);
    return page;
}

/**
 * Method to set homePage based on user login. Sets up instructor and student.
 * @param {*} req : user request
 * @param {*} res : server response
 * @param {*} formData : formData from login input
 */
function homePage(req, res, formData, faq) {

    if (formData.username === undefined || formData.role === undefined) {
        formData.username = findUsername(req);
        formData.role = findRole();
    }

    if (formData.role === "instructor") {
        //set instructor own page.
        roleStatus = 1; // set roleStatus as instructor
        setInstructorView(req, res, formData, faq);
    }
    // set student view
    else {

        roleStatus = 0; // set roleStatus as student
        let user = "username=" + formData.username;
        // let role = "role=" + formData.role;
        // let cookie = [user, role];
        let cookie = [user];

        try {
            res.writeHead(200, {
                "content-type": "text/html",
                // "set-cookie": cookie[0] + " ;" + cookie[1], // user ; role
                "set-cookie": cookie[0], // user 
            });
            readFile("./Lab2/html/home.html", function (err, content) {

                if (err) {
                    console.log("homePage error: ", err);
                }
                // for some reason, have to replace each instance of {username} hence 1 and 2 appended.
                content = content.toString().replace('{username1}', formData.username);
                content = content.toString().replace('{username2}', formData.username);
                content = content.toString().replace('{role}', formData.role);
                content = content.toString().replace('{addQA}', "");

                // diplay item list from QA
                let items = faq.filter(formData);
                let page = displayQAItems(items, formData.role);
                content = content.toString().replace('{item}', page);
                res.write(content);
                res.end();
            });
        } catch (err) {
            console.log("homePage Student error: ", err);
        }
    }
    serverLog("Search filter items set.");
}

/**
 * Method to set the view for the instructor's home page.
 * @param {*} req : user request
 * @param {*} res : server response
 * @param {*} formData : user form data input
 * @param {*} faq : faq object containing QA information
 */
function setInstructorView(req, res, formData, faq) {

    // let role = "";
    let user = "";
    // belore if-statement used for redirects back to home page from edit/add QA
    if (formData.username === undefined || formData.role === undefined) {
        formData.username = findUsername(req);
        formData.role = findRole();
    }
    user = "username=" + formData.username;
    // role = "role=" + formData.role;
    let cookie = [user];
    serverLog("Setting home page by role: " + formData.role);
    try {
        res.writeHead(200, {
            "content-type": "text/html",
            // "set-cookie": cookie[0] + " ;" + cookie[1], // user ; role 
            "set-cookie": cookie[0],
        });
        readFile("./Lab2/html/home.html", function (err, content) {
            if (err) {
                console.log("homePage error: ", err);
            }
            // for some reason, have to replace each instance of {username} hence 1 and 2 appended.
            content = content.toString().replace('{username1}', formData.username);
            content = content.toString().replace('{username2}', formData.username);
            content = content.toString().replace('{role}', formData.role);
            //Make QA button
            const QAButton =
                "<button name=\"addQAButton\" onClick=\"window.location.href='/add';\">Add QA</button>\n";

            content = content.toString().replace('{addQA}', QAButton);

            // diplay item list from QA
            let items = faq.filter(formData);
            let page = displayQAItems(items, formData.role)
            content = content.toString().replace('{item}', page);
            res.write(content);
            res.end();
        });
    } catch (err) {
        console.log("setInstructorView error: ", err);
    }
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

/** Helper method to set role based on roleStatus
 * @returns instructor if roleStatus is 1, student otherwise.
 */
function findRole() {
    return (roleStatus === 1) ? "instructor" : "student";
}


/**
 * Helper method to get username from cookie.
 * @param {*} req :req object
 * @returns username in cookie.
 */
function findUsername(req) {
    let username = req.headers.cookie;
    username = username.split("=");
    return username[1];
}

/**
 * Method to check user login.  Validates login credentials.
 * @param {*} postData : user post info
 * @param {*} res : server response
 * @returns 200 if login validates, 402 otherwise.
 */
function checkLogin(postData) {

    //check page access
    const status = checkAuthorization(postData);
    if (status === 401) {
        return 401;
    }

    // login validation
    for (let i in fake.db) {

        if (postData.username === fake.db[i].username &&
            postData.password == fake.db[i].password &&
            postData.role == fake.db[i].role) {
            return 200;
        }
    }
    return 403;
}

/**
 * Method to check authorization; checks unauthorized page access.
 * @param {*} postParams : login parameters from user
 * @returns 401 if invalid, 200 if valid.
 */
function checkAuthorization(postData) {

    // check if the user tried to access a protected page
    if (postData.username === undefined ||
        postData.password === undefined ||
        postData.role === undefined) {
        return 401;
    }
    return 200;
}

/**
 * Method to set edit page, instructor access only.  Instructors only can access.
 * Instructor can edit answers and tags of a question.
 * @param {*} req : user request
 * @param {*} res : server response
 */
function editPage(req, res) {
    res.writeHead(200, { "content-type": "text/html" });

    readFile('./Lab2/html/edit.html', function (err, content) {

        if (err) {
            console.log("edut error: " + err);
        }
        let username = req.headers.cookie;
        username = username.split("=");

        content = content.toString().replace("{username1}", username[1]);
        content = content.toString().replace("{role}", "instructor");
        // TODO:  replace {question}, {answer}, {tags}
        res.write(content);
        res.end();
    });
}

function addPage(req, res) {

    res.writeHead(200, { "content-type": "text/html" });
    readFile('./Lab2/html/add.html', function (err, content) {

        if (err) {
            console.log("add page error: " + err);
        }
        let username = req.headers.cookie;
        username = username.split("=");

        content = content.toString().replace("{username1}", username[1]);
        content = content.toString().replace("{role}", "instructor");
        content = content.toString().replace("{errorText}", "");
        res.write(content);
        res.end();
    });
}

/**
 * Method to set login page, replacing setPage() funct
 * @param {*} req : user request
 * @param {*} res : server response
 */
function loginPage(req, res) {

    res.writeHead(200, { "content-type": "text/html" });
    readFile('./Lab2/html/login.html', function (err, content) {

        if (err) {
            console.log("login error: " + err);
        }
        // check cookies and set content
        if (req.headers.cookie) {
            let username = req.headers.cookie;
            username = username.split("=");
            const greeting = "Welcome back " + username[1] + ", please enter your password.";

            content = content.toString().replace("{login}", greeting);
            content = content.toString().replace("{Username}", username[1]);
            res.write(content);
            res.end();
        } else {
            content = content.toString().replace("{login}", "Login Page");
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
    serverLog("Logging out user...");
    res.writeHead(200, { "content-type": "text/html" });
    roleStatus = 0;
    try {
        readFile("./Lab2/html/login.html", function (err, content) {
            if (err) {
                console.log("logout error: ", err);
            }
            let username = req.headers.cookie;
            username = username.split("=");
            content = content.toString().replace("{login}", "You have been logged out.");
            content = content.toString().replace("{Username}", username[1]);
            resultFunc(content);
        });
    } catch (err) {
        console.log("logout error: ", err);
    }
}

function addQASave(req, res, formData, faq) {
    console.log("question: ", formData.questionText);
    console.log("answer: ", formData.answerText);
    console.log("tags: ", formData.tagsText);

    //check fields for addQA
    const qaCheck = addQACheck(formData);
    // if check OK, add the QA to the store
    if(qaCheck) {
        faq.writeQA(formData.questionText, 
            formData.answerText, 
            formData.tagsText,
            findUsername(),
            new Date().toISOString());
        setInstructorView(req, res, formData, faq);
    } else {
        try {
            res.writeHead(200, { "content-type": "text/html" });
            readFile('./Lab2/html/add.html', function (err, content) {
    
                if (err) {
                    console.log("add page error: " + err);
                }
                let username = req.headers.cookie;
                username = username.split("=");
                const error = "One or more fields missing. Please fill out all fields.";
                content = content.toString().replace("{username1}", username[1]);
                content = content.toString().replace("{role}", "instructor");
                content = content.toString().replace("{errorText}", error);
                res.write(content);
                res.end();
            });
        } catch (err) {
            console.log("addQASave error: ", err);
        }
    }


}

function addQACheck(formData) {

    if(formData.questionText === undefined || 
        formData.answer === undefined || 
        formData.tags === undefined) {
         return false;
        }
    return true;
}

/**
 * Method to set pageNotFound page, replacing setPage() funct
 * @param {*} req : user request
 * @param {*} res : server response
 */
function pageNotFound(res) {

    serverLog("Status 404, page not found.");
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

    serverLog("Access denied. Unauthorized.")
    res.writeHead(401, { "content-type": "text/html" });
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
 * Method to set page for invalid login info display to user.
 * @param {*} res 
 */
function loginInvalid(res) {

    serverLog("Login failed. Invalid login credentials.");
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

/**
 * Method to normalize server console logs.
 * @param {*} message : message to be logged from server.
 */
function serverLog(message) {
    console.log("Server: " + message);
}
