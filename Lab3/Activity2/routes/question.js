/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const fs = require("fs");
let mongo = require("../db/mongo");
const MongoClient = require("mongodb").MongoClient;

const paths = require("../services/constants");
const logger = require("../services/log");

/**
 * GET '/' redirect to first question page
 */
router.all("/", (req, res, next) => {
  logger.serverLog('redirect "/question" page to "question/1"');
  res.redirect("/question/1");
});

/**
 * GET '/:qid' by question id
 */
router.all("/:qid", async (req, res, next) => {
  logger.serverLog("Questions page, id: " + req.params.qid);
  req.session.userAnswers = [];
  // console.log(req.session.userAnswers);
  let message = "";
  let questions = await getQuestions(res);

  if (questions === "empty") {
    message = "No Questions found";
    questions = { emptyMessage: message };
  }
  let prefs = getDisplayPrefs(req);
  console.log(prefs);

  let qid = req.params.qid;
  //set mongoclient
  MongoClient.connect(
    paths.MONGO_URL,
    { useUnifiedTopology: true, useNewUrlParser: true },
    function (err) {
      try {
        if (err) {
          let error = logger.setErrorMessage(500, err);
          logger.errorLog("MongoClient", error);
        }
        console.log("Mongo database client connected!");
      } catch (err) {
        logger.errorLog("MongoClient", err);
      }
    }
    //TODO add
  );

  res.render("question", { title: "The question page" });
});

/**
 * Method to get questions. Reads question file from resource folder.
 * @param {*} res : server response
 * @returns parsed json questions.
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

/**
 * Method to user display preferences.
 * @param {*} req : request object.
 * @returns horizontal if user selected, vertical otherwise.
 */
function getDisplayPrefs(req) {
  // console.log(req.body.display);
  if (req.body.display === "horizontal") {
    return req.body.display;
  } else {
    return "vertical";
  }
}

module.exports = router;
