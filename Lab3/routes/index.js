/* eslint-disable no-unused-vars */
let express = require("express");
let fs = require("fs");
let path = require("path");
let router = express.Router();

const FILE_DIR = path.resolve();
const ARTICLE_FILE = "/resource/article.txt";
const COMMENTS_JSON = "/resource/comments.json";

/**
 * GET '/' home page with async callback.
 */
router.get("/", async function (req, res, next) {
  let article = await getArticle(res);
  let comments = await getComments(res);

  let title = "Sample of Article: ";
  //render the article to articleBody
  res.render("index", {
    title: "Welcome to the Article Reviewer App",
    articleTitle: title,
    articleBody: article.toString(),
    commentList: comments,
  });
});

// TODO GETS for /view /reset
// TODO POST REQUEST for /add /undo /delete
router.post("/add", function (req, res, next) {
  
});

/**
 * Method to get Article. Reads in article sample from resource folder.
 * @param {*} res : server response
 * @returns : sample article from resource folder, writes error if it doesn't exist.
 */
function getArticle(res) {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(FILE_DIR.concat(ARTICLE_FILE), "UTF8", function (err, data) {
        if (err) {
          errorLog("readFile", err);
          let error = promiseRejectError(500, err.message);
          // render the pug error template
          reject(res.render("error", { error }));
        } else {
          resolve(data.toString());
        }
      });
    } catch (err) {
      errorLog("getArticle error: ", err);
    }
  });
}

/**
 * Method to get comments. Reads comment file from resource folder.
 * @param {*} res : server response
 * @returns parsed json comments.
 */
function getComments(res) {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(FILE_DIR.concat(COMMENTS_JSON), "UTF8", function (err, data) {
        if (err) {
          errorLog("readFile", err);
          let error = promiseRejectError(500, err.message);
          // render the pug error template
          reject(res.render("error", { error }));
        }

        let comments = JSON.parse(data);
        if (comments.length === 0 || comments === "") {
          // set an initial, blank comment.
          let commentArray = { id: "", comment: "" };
          comments.push(commentArray);
          resolve(comments);
        } else {
          // console.log(data);
          resolve(comments);
        }
      });
    } catch (err) {
      errorLog("getArticle error: ", err);
    }
  });
}

/**
 * Method to handle promise rejection status and messages for error pug
 * @param {*} statusCode : status code of error
 * @param {*} errorMessage : message of error
 * @returns : object containing error
 */
function promiseRejectError(statusCode, errorMessage) {
  let error = {
    status: statusCode,
    message: errorMessage,
  };
  return error;
}

/**
 * Method to normalize error logs from server.
 * @param {*} location : location of the error
 * @param {*} err : error message and stacktrace to log
 */
function errorLog(location, err) {
  console.log("ErrorLog: ", location, ": ", err);
}

/**
 * Method to normalize server logs.
 * @param {*} message : message to log
 */
function serverLog(message) {
  console.log("Server: ", message);
}

module.exports = router;
