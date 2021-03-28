/* eslint-disable no-unused-vars */
const { FILE } = require("dns");
let express = require("express");
let fs = require("fs");
let path = require("path");
let router = express.Router();

const FILE_DIR = path.resolve();
const ARTICLE_FILE = "/resource/article.txt";
const COMMENTS_JSON = "/resource/comments.json";
const HISTORY_JSON = "/resource/history.json";
let historyStack = [];

/**
 * GET '/' home page with async callback.
 */
router.get("/", async function (req, res, next) {
  getStackHistory(res);

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

/**
 * GET '/view' user activity page with async callback
 */
router.get("/view", async function (req, res, next) {
  let history = await getHistory(req, res);
  // console.log(history);
  let activityTitle = "User Activity";

  if (history === "empty") {
    history = {
      item: "No User Activity",
    };
    serverLog("No User Activity in History,");
    res.render("view", {
      title: activityTitle.toString(),
      historyList: history,
    });
  } else {
    let stack = [];
    for (let item in history) {
      stack.push(
        `${history[item].operation}, 
        ${history[item].id}, 
        ${history[item].comment}, 
        ${history[item].ip}, 
        ${history[item].userAgent}`
      );
    }
    serverLog("Rendering User Activty with " + stack.length + " entries.");
    res.render("view", {
      title: activityTitle.toString(),
      historyList: stack,
    });
  }
});

//TODO
router.get("/reset", async function (req, res, next) {
  let reset = await resetActivity(res);
});

// TODO GETS for /reset
// TODO POST REQUEST for /add /undo /delete
router.post("/add", async function (req, res, next) {
  //check id duplication
  console.log(historyStack.length);
  let errorFlag = false;
  for (let item in historyStack) {
    if (historyStack[item].id.toString() === req.body.commentId.toString()) {
      errorFlag = true;
    }
  }

  // check bad input
  if (req.body.commentId === undefined || req.body.commentText === "") {
    let error = promiseRejectError(
      406,
      "CommentId and CommentText must be defined."
    );
    res.render("error", { error });
  } else if (errorFlag) {
    let error = promiseRejectError(
      409,
      "Comment Id is duplicated, please choose a different Comment Id."
    );
    res.render("error", { error });
  } else {
    // //add new comment to the stack
    historyStack.unshift({
      operation: req.body.addComment,
      id: req.body.commentId,
      comment: req.body.commentText,
      ip: req._remoteAddress,
      userAgent: req.headers["user-agent"],
    });
    // console.log(historyStack);

    //write to files and render the view
    // comments json
    writeToFile(res, COMMENTS_JSON, historyStack);
    // history json
    writeToFile(res, HISTORY_JSON, historyStack);

    // render response view
    let title = "Comment Successfully Added";
    res.render("response", {
      title: title.toString(),
    });
  }
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
 * Method to set stack history.  Pushes to a history data structure
 * that is used for add/delete/reset functionality.
 * @param {*} res : server response
 */
async function getStackHistory(res) {
  let history = await getHistory(res);
  if (history.length === "empty") {
    historyStack = [];
    serverLog("HistoryStack initialized");
  } else if (historyStack.length > 0) {
    serverLog(
      `HistoryStack already initialized, has length: ${historyStack.length}`
    );
  } else {
    for (let item in history) {
      historyStack.unshift(history[item]);
    }
    serverLog(`HistoryStack pushed history, is length: ${historyStack.length}`);
  }
}

/**
 * Method to get user activity history. Reads history file from resource folder
 * @param {*} res : server response
 * @returns parsed history objects of user activity.
 */
function getHistory(res) {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(FILE_DIR.concat(HISTORY_JSON), "UTF8", function (err, data) {
        if (err) {
          errorLog("readFile", err);
          let error = promiseRejectError(500, err.message);
          reject(res.render("error", { error }));
        }
        let history = JSON.parse(data);
        if (history.length === 0 || history === "") {
          resolve("empty");
        } else {
          resolve(history);
        }
      });
    } catch (err) {
      errorLog("getHistory error: ", err);
    }
  });
}

//TODO RESET FUNCTION
function resetActivity(res) {
  return new Promise(function (resolve, reject) {
    try {
      // fs.readFile(FILE_DIR.concat(HISTORY_JSON), "UTF8", function (err, data) {
      //   if (err) {
      //     errorLog("readFile", err);
      //     let error = promiseRejectError(500, err.message);
      //     reject(res.render("error", { error }));
      //   }
      //   let history = JSON.parse(data);
      //   if (history.length === 0 || history === "") {
      //     resolve("empty");
      //   } else {
      //     resolve(history);
      //   }
      // });
    } catch (err) {
      // errorLog("getHistory error: ", err);
    }
  });
}

/**
 * Method to write data to file
 * @param {*} res : server response
 * @param {*} file : file to write
 * @param {*} data : data to write to file
 */
function writeToFile(res, file, data) {
  try {
    fs.writeFileSync(
      FILE_DIR.concat(file),
      JSON.stringify(data),
      "UTF8",
      function (err) {
        if (err) {
          let error = promiseRejectError(500, err.message);
          res.render("error", { error });
        }
      }
    );
  } catch (err) {
    errorLog("WriteToFile", err);
  }
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
