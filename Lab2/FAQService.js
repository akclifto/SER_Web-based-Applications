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
                "isActive": false,
            },
            {
                "username": "stu",
                "password": "stu",
                "role": "student",
                "isActive": false,
            }];
    }

    /**
     * Method workaround to login status as active/inactive
     * @param {*} username : username to change status
     * @param {*} isActive : boolean value for active/inactive status
     */
    setActiveStatus(username, activeStatus) {
        for (let i in fake.db) {
            if (username === fake.db[i].username) {
                fake.db[i].isActive = activeStatus;
                serverLog("Active status set to " + fake.db[i].isActive + " for user: " + fake.db[i].username);
                return true
            }
        }
        serverLog("User not found in persistent store.  Active Status unchanged");
        return false;
    }
}

// load up the fake database.
const fake = new FakeDatabase();

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
            routeGetPaths(req, res, faq);
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
function routeGetPaths(req, res, faq) {
    // console.log("faq: ", faq.dataStore);
    if (req.url == "/home") {

        processFormData(req, res, function (formData) {
            let status = checkLogin(req, formData);
            if (status === 401) {
                unAuthorizedAccess(res);
            } else {
                routePath(req, res, formData, faq);
            }
        });
    }
    else if (req.url == "/edit" || req.url == "/add") {
        if (findRole(req) === "student") {
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
    }
    if (req.url === "/home") {
        // get user form data for posts
        processFormData(req, res, function (formData) {

            if (formData.search) {
                homePage(req, res, formData, faq);
            }
            if (formData.addQASave) {
                addQASave(req, res, formData, faq);

            }
            if (formData.editCancel || formData.addQACancel) {
                homePage(req, res, formData, faq);
            }
            if (formData.delete) {
                deleteQA(formData.itemId, faq);
                homePage(req, res, formData, faq);
            }
            if (formData.edit) {
                manageQA(req, res, formData);
            }
            if (formData.editSave) {
                editSaveQA(req, res, formData, faq);
            }
            if (formData.login) {
                let status = checkLogin(req, formData);
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
function routePath(req, res, formData, faq) {

    if (req.url === "/") {
        serverLog("\"/\" page.  Redirecting to login page.")
        req.url = "/login";
        routePath(req, res);
    }
    else if (req.url === "/login") {
        loginPage(req, res);
    }
    else if (req.url === "/edit") {
        if (formData === undefined) {
            unAuthorizedAccess(res);
        } else {
            manageQA(req, res, formData);
        }
    }
    else if (req.url === "/add") {
        manageQA(req, res, res, formData);
    }
    else if (req.url === "/home") {
        homePage(req, res, formData, faq);
    }
    else {
        pageNotFound(res);
    }
}

/**
 * Method to display QA Items on home page.
 * @param {*} items 
 * @returns formatted list of QA items to display.
 */
function displayQAItems(items, role) {
    let display = "";

    // Check no filtered results.  
    // If the first item is undefined, all items will be undefined.
    if (role === "student") {

        if (items[0] === undefined) {
            display = "<b>No results from search filter. <b>";
            return display;
        }
        let addToPage = items.map((item) => {
            let itemContent =
                "<b>" + item.question + "</b><br/>" +
                item.answer + "<br/>" +
                "Tags: " + item.tags + "<br/>" +
                item.author + "<br/>" +
                new Date(item.date).toDateString() + "<br/>";
            return itemContent;
        });
        display = "<br />" +
            "<div classname=\"item-list\" id=\"item-list\">" +
            addToPage.join("<br/>") +
            "</div>";
        return display;
    } else {

        if (items[0] === undefined) {
            display = "<br />" +
                "<button name=\"addQAButton\" onClick=\"window.location.href='/add';\">Add QA</button>" +
                "<br/><br/>" + "<b>No results from search filter. <b>";
            return display;
        }

        let addToPage = items.map((item) => {
            let itemContent =

                "<b>" + item.question + "</b><br />" +
                item.answer + "<br/>" +
                "Tags: " + item.tags + "<br/>" +
                item.author + "<br/>" +
                new Date(item.date).toDateString() + "<br/>" +

                "<form type=\"submit\" action=\"/home\" method=\"post\" style=\"margin-bottom:0\">" +
                "<input type=\"submit\" name=\"edit\" value=\"Edit\" id=\"edit\">" +
                "<input type=\"submit\" value=\"Delete\" name=\"delete\" id=\"delete\">" +
                "<input type=\"hidden\" name=\"itemQuestion\" value=" + JSON.stringify(item.question) + ">" +
                "<input type=\"hidden\" name=\"itemAnswer\" value=" + JSON.stringify(item.answer) + ">" +
                "<input type=\"hidden\" name=\"itemTags\" value=" + JSON.stringify(item.tags) + ">" +
                "<input type=\"hidden\" name=\"itemId\" value=" + item.id + ">" +
                "</form> ";

            return itemContent;
        });

        display =
            "<br />" +
            "<button name=\"addQAButton\" onClick=\"window.location.href='/add';\">Add QA</button>" +
            "<br/><br/>" +
            "<div classname=\"item-list\" id=\"item-list\" style=\"white-space:pre-wrap;\">" +
            addToPage.join("<br/>") +
            "</div>";
        return display;
    }
}

/**
 * Method to delete QA from faq datastore
 * @param {*} id : id to delete
 * @param {*} faq : faq object containing QA information
 */
function deleteQA(id, faq) {
    let success = faq.deleteQA(id);
    if (success) {
        serverLog("QA with id: " + id + " successfully deleted.");
    } else {
        serverLog("Id not found in persistent store. QA was not deleted.");
    }
}

/**
 * Method to edit QA from faq datastore
 * @param {*} formData : user input for edit updates
 * @param {*} faq : faq object containing QA information
 */
function editSaveQA(req, res, formData, faq) {
    //check fields 
    const qaCheck = addQACheck(formData);
    // if check OK, make updates
    if (qaCheck) {
        let success = faq.updateAnswer(formData.itemId, formData.answerText);
        if (success) {
            serverLog("Answer updated for id: "+ formData.itemId);
        } else {
            serverLog("Answer was not updated for id: " + formData.itemId);
        }
        success = faq.updateTags(formData.itemId, formData.tagsText);
        if (success) {
            serverLog("Tags updated for id: " + formData.itemId);
        } else {
            serverLog("Tags were not updated for id: " + formData.itemId);
        }
        homePage(req, res, formData, faq);
    } else {
        res.writeHead(200, { "content-type": "text/html" });
        try {
            readFile('./Lab2/html/home.html', function (err, content) {
                let page = "";

                page = setPageHead(findUsername(req), findRole(req));
                page = page.concat(" ", editContentPage(formData));

                const error = "One or more fields are missing. Please fill out all fields before saving.";
                content = content.toString().replace("{content}", page);
                content = content.toString().replace("{question}", formData.itemQuestion);
                content = content.toString().replace("{answer}", formData.answerText);
                content = content.toString().replace("{tags}", formData.tagsText);
                content = content.toString().replace("{errorText}", error);
                res.write(content);
                res.end();
            });
        } catch (err) {
            console.log("editSaveQA error: ", err);
        }
    }
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
        formData.role = findRole(req);
    }

    let user = "username=" + formData.username;

    try {
        res.writeHead(200, {
            "content-type": "text/html",
            "set-cookie": user, // user 
        });
        readFile("./Lab2/html/home.html", function (err, content) {

            if (err) {
                console.log("homePage error: ", err);
            }
            let page = setPageHead(formData.username, formData.role);
            page = page.concat(" ", homepageContentBody(formData.username));

            //write out the QA item list
            let items = faq.filter(formData);
            // add QA here, itemList and admin priv for instructor
            let itemList = displayQAItems(items, formData.role, faq);
            page = page.concat(" " + itemList);
            content = content.toString().replace('{content}', page);
            res.write(content);
            res.end();
        });
    } catch (err) {
        console.log("homePage Student error: ", err);
    }
    serverLog("Search filter items set.");
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

/** Helper method to set role based on database.  Multi-cookies do not function properly in browser.
 * This is a workaround to get role.
 * @returns instructor if roleStatus is 1, student otherwise.
 */
function findRole(req) {

    let username = qstringParse(req.headers.cookie);
    username = username.username.toString();
    for (let i in fake.db) {
        if (username === fake.db[i].username) {
            return fake.db[i].role;
        }
    }
    return "No Role Found";
}


/**
 * Helper method to get username from cookie.
 * @param {*} req :req object
 * @returns username in cookie.
 */
function findUsername(req) {
    if (req.headers === undefined) {
        return "Username";
    }
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
function checkLogin(req, postData) {

    //check page access
    const status = checkAuthorization(postData);
    if (status === 401) {
        let user = findUsername(req);
        for (let i in fake.db) {
            if (user === fake.db[i].username && fake.db[i].isActive === true) {
                return 200;
            }
        }
        return 401;
    }
    // login validation
    for (let i in fake.db) {

        if (postData.username === fake.db[i].username &&
            postData.password === fake.db[i].password &&
            postData.role === fake.db[i].role) {
            fake.setActiveStatus(postData.username.toString(), true);
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
 * Method to set edit and add page, instructor access only.
 * @param {*} req : user request
 * @param {*} res : server response
 */
function manageQA(req, res, formData) {

    try {
        readFile('./Lab2/html/home.html', function (err, content) {
            res.writeHead(200, { "content-type": "text/html" });

            if (err) {
                console.log("manageQA error: " + err);
            }
            let username = findUsername(req);
            let role = findRole(req);
            let page = setPageHead(username, role);

            if (req.url === "/add") {
                // add content page
                let add = addContentPage();
                page = page.concat(" ", add);
                content = content.toString().replace("{content}", page);
                content = content.toString().replace("{errorText}", "");
                res.write(content);
                res.end();
            } else {
                //edit page content
                let edit = editContentPage(formData);
                page = page.concat(" ", edit);
                content = content.toString().replace("{content}", page);
                content = content.toString().replace("{question}", formData.itemQuestion);
                content = content.toString().replace("{answer}", formData.itemAnswer);
                content = content.toString().replace("{tags}", formData.itemTags);
                content = content.toString().replace("{errorText}", "");
                res.write(content);
                res.end();
            }
        });
    } catch (err) {
        console.log("editPage error", err);
    }
}

/**
 * Method to set the content for the /edit page. instructor access only.
 * @returns content for the /edit page.
 */
function editContentPage(formData) {
    let page =
        "<p style=\"text-align:center\">In this form you can edit the answer and tags.</p>" +
        "<p style=\"text-align:center\"><b>{question}</b></p>" +
        "<br />" +

        "<form action=\"/home\" method=\"post\" style=\"text-align:center\">" +
        "<label name=\"answer\"> Answer:</label> <br />" +
        "<textarea name=\"answerText\" id=\"answerText\" rows=\"10\" cols=\"50\">{answer}</textarea><br />" +

        "<label name=\"tags\"> Tags:</label> <br />" +
        "<textarea name=\"tagsText\" id=\"tagsText\" rows=\"10\" cols=\"50\">{tags}</textarea><br />" +

        "<b>{errorText}</b> <br />" +

        "<input type=\"submit\" value=\"Save Edit\" name=\"editSave\" >" +
        "<input type=\"hidden\" name=\"itemId\" value=" + formData.itemId + ">" +
        "<input type=\"hidden\" name=\"questionText\" value=" + JSON.stringify(formData.itemQuestion) + ">" +
        "<a href=\"/home\"><input type=\"submit\" value=\"Cancel\" name=\"editCancel\"></a>" +
        "</form>";
    return page;
}

/**
 * Method to set the content for the /add page. Instructor access only.
 * @returns content for the /add page
 */
function addContentPage() {
    let page =
        "<p style=\"text-align:center\">Add a new Question:</p>" +
        "<p style=\"text-align:center\"><b>Question:</b></p>" +

        "<form action=\"/home\" method=\"post\" style=\"text-align:center\">" +
        "<textarea name=\"questionText\" id=\"questionText\" " +
        "placeholder=\"Enter question here...\" rows=\"10\" cols=\"50\"></textarea><br />" +

        "<br />" +

        "<label name=\"answer\"> Answer:</label> <br />" +
        "<textarea name=\"answerText\" id=\"answerText\" rows=\"10\" cols=\"50\"" +
        "placeholder=\"Enter answer here...\"></textarea><br />" +

        "<label name=\"tags\"> Tags:</label> <br />" +
        "<textarea name=\"tagsText\" id=\"tagsText\" rows=\"10\" cols=\"50\"" +
        "placeholder=\"Enter tags...\"></textarea><br />" +

        "<b>{errorText}</b> <br />" +

        "<input type=\"submit\" value=\"Add QA\" name=\"addQASave\" >" +
        "<a href=\"/home\"><input type=\"submit\" value=\"Cancel\" name=\"addQACancel\"></a>" +
        "</form>";
    return page;
}

/**
 * Method to set the page head with the message and logout button that are on each page.
 * @param {*} username : username for message
 * @param {*} role : role for message
 * @returns content of page head.
 */
function setPageHead(username, role) {
    let page =
        "<p> Hello <b>" + username + "</b>, you are logged in as <b>" + role + "</b>:</p>" +

        "<form action=\"/\" method=\"post\" style=\"text-align: end\">" +
        "<input type=\"submit\" value=\"Logout\" name=\"logout\" id=\"logout\">" +
        "</form>";
    return page;
}

/**
 * Method to set the homepage content body.
 * @param {*} username : username of user
 * @returns content of the homepage body.
 */
function homepageContentBody(username) {

    let page =
        "<p style=\"text-align: center\">Welcome " + username + " to the View Q&A homepage.</p>" +
        "<p style=\"text - align: center\">Put in your filter/search options.</p>" +

        "<form action = \"/home\" method=\"post\"> " +
        "<label name=\"username\">Author</label> " +
        "<input type=\"text\" name=\"author\" placeholder=\"Author\"> " +

        "<label name=\"tags\">Tags</label>" +
        "<input type=\"text\" name=\"tags\" placeholder=\"Tags\">" +

        "<label name=\"startdate\">Start Date</label>" +
        "<input type=\"Date\" name=\"startdate\" placeholder=\"mm/dd/yyyy\">" +

        "<label name=\"enddate\">End Date</label>" +
        "<input type=\"Date\" name=\"enddate\" placeholder=\"mm/dd/yyyy\">" +

        "<input type=\"submit\" value=\"Search\" name=\"search\" >" +
        "</form>";
    return page;
}

/**
 * Method to set login page, replacing setPage() funct
 * @param {*} req : user request
 * @param {*} res : server response
 */
function loginPage(req, res) {

    res.writeHead(200, { "content-type": "text/html" });
    try {
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
    } catch (err) {
        console.log("loginPage error: ", err);
    }
}

/**
 * Method to logout and redirect to login screen.
 * @param {*} req : user request
 * @param {*} res : server response
 * @param {*} resultFunc : callback function result
 */
function logout(req, res, resultFunc) {

    serverLog("Logging out user " + findUsername(req));

    fake.setActiveStatus(findUsername(req), false);

    res.writeHead(200, { "content-type": "text/html" });
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

/**
 * Method to add a new QA to the faq data store.  This will do preliminary check to 
 * ensure fields are valid, and if so, will write the new QA to the data store.
 * @param {*} req : user request
 * @param {*} res : server response
 * @param {*} formData : user input form data
 * @param {*} faq : faq object containing QA information
 */
function addQASave(req, res, formData, faq) {

    //check fields for addQA
    const qaCheck = addQACheck(formData);
    // if check OK, add the QA to the store
    if (qaCheck) {
        faq.writeQA(formData.questionText,
            formData.answerText,
            formData.tagsText,
            findUsername(req),
            new Date().toISOString());
        serverLog("New QA has been successfully added.");
        homePage(req, res, formData, faq);
    } else {
        res.writeHead(200, { "content-type": "text/html" });
        try {
            readFile('./Lab2/html/home.html', function (err, content) {
                let page = "";

                page = setPageHead(findUsername(req), findRole(req));
                page = page.concat(" ", addContentPage());

                const error = "One or more fields are missing. Please fill out all fields to add a question.";
                content = content.toString().replace("{content}", page);
                content = content.toString().replace("{errorText}", error);
                res.write(content);
                res.end();
            });
        } catch (err) {
            console.log("addQASave error: ", err);
        }
    }
}

/**
 * Method to validate add QA form.
 * @param {*} formData : user form data input
 * @returns true if add QA form is valid, false otherwise.
 */
function addQACheck(formData) {

    if (formData.questionText === undefined || formData.questionText === "" ||
        formData.answerText === undefined || formData.answerText === "" ||
        formData.tagsText === undefined || formData.tagsText === "") {
        // console.log("Some fields are missing in add QA");
        return false;
    }
    // console.log("add QA field check passed.");
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
    let page =
        "<html><head><title></title></head>" +
        "<body>" +
        "<p>404 Page Not Found!</p> " +
        "<a href=\"/\"> Return to Login </a>" +
        "</body></html>";
    res.write(page);
    res.end();
}

/**
 * Set page for unauthorized access.  Links back to login page.
 * @param {*} res : server response
 */
function unAuthorizedAccess(res) {

    serverLog("Access denied. Unauthorized.")
    res.writeHead(401, { "content-type": "text/html" });
    let page =
        "<html><head><title></title></head>" +
        "<body>" +
        "<p>You do not have permission to view this page.</p> " +
        "<a href=\"/\"> Return to Login </a>" +
        "</body></html>";
    res.write(page);
    res.end();
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
