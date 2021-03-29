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
let activityStack = [];

/**
 * GET '/' home page with async callback.
 */
router.get("/", async function (req, res, next) {
  getStackHistory(res);

  let article = await getArticle(res);
  let comments = await getComments(res);
  let title = "Welcome to the Article Reviewer App";
  let articleTitle = "Sample of Article: ";
  let message = "";
  //check for comments
  if (comments === "empty") {
    message = "No Comment History";
    comments = { emptyMessage: message };
  }
  //render the article to articleBody
  res.render("index", {
    title,
    articleTitle,
    articleBody: article.toString(),
    commentList: comments,
    emptyMessage: message,
  });
});

/**
 * GET '/add' render error message.
 */
router.get("/add", function (req, res, next) {
  let msg =
    "You weren't supposed to do that ;) Go back to the main page and add comments using the fields.";
  let error = setErrorMessage(401, msg);
  res.render("error", { error });
});

/**
 * GET '/view' user activity page with async callback
 */
router.get("/view", async function (req, res, next) {
  let history = await getHistory(res);
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
        ${history[item].operand}, 
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

/**
 * GET '/reset' method to reset user activity.
 */
router.get("/reset", async function (req, res, next) {
  let reset = await resetActivity(res);
  if (reset) {
    let title = "User Activity Reset Successfully";
    res.render("response", { title });
  } else {
    let error = setErrorMessage(500, "User Activity could not be reset");
    res.render("error", { error });
  }
});

/**
 * GET '/delete renders error message
 */
router.get("/delete", function (req, res, next) {
  let msg =
    "You weren't supposed to do that ;) Go back to the main page and delete comments using the fields.";
  let error = setErrorMessage(401, msg);
  res.render("error", { error });
});

/**
 *
 */
router.post("/undo", async function (req, res, next) {
  console.log("act: ", activityStack.length);

  try {
    // pop history
    let history = await getHistory(res);
    // console.log(history);
    let pop = history.pop();
    if (pop.operation === "Delete") {
      //TODO
    }
    writeToFile(res, HISTORY_JSON, history);
    // pop comments
    let comments = await getComments(res);
    console.log(comments);
    comments.pop();
    writeToFile(res, COMMENTS_JSON, comments);
    //render response
    let title = "Undo Operation Successful.";
    res.render("response", { title });
  } catch (err) {
    errorLog("router /undo", err);
    let error = setErrorMessage(500, err.message);
    res.render("error", { error });
  }
});

/**
 * POST '/add' method to add comment to history and activity.
 */
router.post("/add", async function (req, res, next) {
  //check id duplication
  let commentHistory = await getComments(res);
  // console.log(commentHistory);

  if (commentHistory === "empty") {
    commentHistory = [];
  }

  let errorFlag = false;
  if (commentHistory.length > 0) {
    for (let item in commentHistory) {
      if (commentHistory[item].id === req.body.commentId) {
        errorFlag = true;
      }
    }
  }

  // check bad input
  if (req.body.commentId === undefined || req.body.commentText === "") {
    let error = setErrorMessage(
      406,
      "CommentId and CommentText must be defined."
    );
    res.render("error", { error });
  } else if (errorFlag) {
    let error = setErrorMessage(
      409,
      "Comment Id is duplicated, please choose a different Comment Id."
    );
    res.render("error", { error });
  } else {
    // //add new comment to the user activity history
    activityStack.push({
      operation: req.body.addComment,
      id: req.body.commentId,
      operand: req.body.commentText,
      ip: req._remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    // add comment to comment history
    commentHistory.push({
      operation: req.body.addComment,
      id: req.body.commentId,
      operand: req.body.commentText,
      ip: req._remoteAddress,
      userAgent: req.headers["user-agent"],
    });
    // console.log(activityStack);

    //write to files and render the view, history json
    writeToFile(res, HISTORY_JSON, activityStack);
    // comments json
    writeToFile(res, COMMENTS_JSON, commentHistory);

    // render response view
    let title = "Comment Successfully Added";
    res.render("response", { title });
  }
});

/**
 * POST '/delete' method to delete a comment from history and activity.
 */
router.post("/delete", async function (req, res, next) {
  let commentHistory = await getComments(res);
  //delete by id from comments
  let deleteFlag = deleteFromComments(req, commentHistory);

  //delete by id from user activity
  let actFlag = deleteFromActivity(req);
  if (actFlag) {
    writeToFile(res, HISTORY_JSON, activityStack);
  }

  if (deleteFlag) {
    writeToFile(res, COMMENTS_JSON, commentHistory);
    let title = "Operation delete complete";
    res.render("response", { title });
  } else {
    let msg = `Id: ${req.body.deleteId} not found. Delete operation could not be completed.`;
    let error = setErrorMessage(400, msg);
    res.render("error", { error });
  }
});

/**
 * Helper method to delete from comments by id.
 * @param {*} req : user request id number
 * @param {*} commentHistory : List to search and delete.
 * @returns true if deleteId, false otherwise
 */
function deleteFromComments(req, commentHistory) {
  // console.log("before: ", commentHistory);
  for (let item in commentHistory) {
    if (commentHistory[item].id === req.body.deleteId) {
      serverLog(
        `Deleting comment from comments by id ${commentHistory[item].id}`
      );

      //push to activity stack
      activityStack.push({
        operation: req.body.delete,
        id: req.body.deleteId,
        operand: commentHistory[item].operand,
        ip: req._remoteAddress,
        userAgent: req.headers["user-agent"],
      });
      //delete the comment from history
      commentHistory.splice(item, 1);
      return true;
    }
  }
  // console.log("after: ", commentHistory);
  serverLog(`Comment by id ${req.body.deleteId} not found in comment history.`);
  return false;
}

/**
 * Helper method to delete from comments by id from user activity stack.
 * @param {*} req : user request id number
 * @returns true if deleteId, false otherwise
 */
function deleteFromActivity(req) {
  for (let item in activityStack) {
    if (activityStack[item].id === req.body.deleteId) {
      serverLog(
        `Delete comment from user activity by id ${activityStack[item].id}`
      );
      // console.log("act stack index: ", activityStack[item]);
      activityStack.splice(item, 1);
      return true;
    }
  }
  serverLog(
    `Comment by id ${req.body.deleteId} not found in user activity history.`
  );
  return false;
}

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
          let error = setErrorMessage(500, err.message);
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
          let error = setErrorMessage(500, err.message);
          // render the pug error template
          reject(res.render("error", { error }));
        }

        let comments = JSON.parse(data);
        if (comments.length === 0 || comments === "") {
          // set an initial, blank comment.
          resolve("empty");
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
  if (history === "empty") {
    activityStack = [];
    serverLog("activityStack initialized");
    serverLog("undoStack initialized");
  } else if (activityStack.length > 0) {
    serverLog(
      `activityStack already initialized, has length: ${activityStack.length}`
    );
  } else {
    for (let item in history) {
      activityStack.push(history[item]);
    }
    serverLog(
      `activityStack pushed history, is length: ${activityStack.length}`
    );
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
          let error = setErrorMessage(500, err.message);
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

/**
 * Method to reset User Activity
 * @param {*} res : server response
 * @returns true promise if reset was successful, false otherwise;
 */
function resetActivity(res) {
  return new Promise(function (resolve, reject) {
    try {
      activityStack = [];
      //reset both of the files.
      writeToFile(res, HISTORY_JSON, activityStack);
      writeToFile(res, COMMENTS_JSON, activityStack);
      resolve(true);
    } catch (err) {
      errorLog("resetActivity", err);
      reject(false);
    }
  });
}

/**
 * Method to write data to file.
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
          let error = setErrorMessage(500, err.message);
          res.render("error", { error });
        }
      }
    );
  } catch (err) {
    errorLog("WriteToFile", err);
  }
}

/**
 * Method to handle error messaging for error pug
 * @param {*} statusCode : status code of error
 * @param {*} errorMessage : message of error
 * @returns : object containing error
 */
function setErrorMessage(statusCode, errorMessage) {
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
