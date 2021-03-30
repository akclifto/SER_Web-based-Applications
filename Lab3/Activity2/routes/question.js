/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

const paths = require("../services/constants");
const logger = require("../services/log");

// router.all("/", (req, res, next) => {
//   console.log("Hit the questions page");
//

//   next();
// });

router.all("/:qid", async (req, res, next) => {
  logger.serverLog("Questions page, id: " + req.params.qid);
  let message = "";
  let questions = await getQuestions(res);
  //check empty question list
  if (questions === "empty") {
    message = "No Questions found";
    questions = { emptyMessage: message };
  }
  // console.log(questions);
  let prefs = await getDisplayPrefs(req);
  console.log(prefs);

  res.render("question", { title: "The question page" });
});

/**
 * Method to get comments. Reads comment file from resource folder.
 * @param {*} res : server response
 * @returns parsed json comments.
 */
function getQuestions(res) {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(
        paths.FILE_DIR.concat(paths.QUESTIONS_JSON),
        "UTF8",
        function (err, data) {
          if (err) {
            logger.errorLog("readFile", err);
            let error = logger.setErrorMessage(500, err.message);
            // render the pug error template
            reject(res.render("error", { error }));
          }

          let questions = JSON.parse(data);
          if (questions.length === 0 || questions === "") {
            // set an initial, blank comment.
            resolve("empty");
          } else {
            // console.log(data);
            resolve(questions);
          }
        }
      );
    } catch (err) {
      logger.errorLog("getArticle error: ", err);
    }
  });
}

function getDisplayPrefs(req) {
  // console.log(req.body.display);
  if (req.body.display === "horizontal") {
    return req.body.display;
  } else {
    return "vertical";
  }
}

module.exports = router;
