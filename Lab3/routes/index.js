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
  console.log(comments);

  let title = "Sample of Article: ";
  //render the article to articleBody
  res.render("index", {
    title: "Welcome to the Article Reviewer App",
    articleTitle: title,
    articleBody: article.toString(),
  });
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
          let error = promiseReject(500, err.message);
          // render the pug error template
          reject(res.render("error", { error }));
        } else {
          resolve(data.toString());
        }
      });
    } catch (err) {
      console.log("getArticle error: ", err);
    }
  });
}

function getComments(res) {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(FILE_DIR.concat(COMMENTS_JSON), "UTF8", function (err, data) {
        if (err) {
          errorLog("readFile", err);
          let error = promiseReject(500, err.message);
          // render the pug error template
          reject(res.render("error", { error }));
        }
        //TODO FINISH THIS doesnt work yet
        if (data !== "") {
          let data = JSON.parse(data);
          resolve(data.toString());
        }
      });
    } catch (err) {
      console.log("getArticle error: ", err);
    }
  });
}

/**
 * Method to handle promise rejection status and messages for error pug
 * @param {*} statusCode : status code of error
 * @param {*} errorMessage : message of error
 * @returns : object containing error
 */
function promiseReject(statusCode, errorMessage) {
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
 * Method ot normalize server logs.
 * @param {*} message : message to log
 */
function serverLog(message) {
  console.log("Server: ", message);
}

module.exports = router;
