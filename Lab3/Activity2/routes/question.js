/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const fs = require("fs");
// const mongo = require("../db/mongo");

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
  // console.log(prefs);
  let userPref = {
    prefh: undefined,
    prefv: true,
  };
  if (prefs === "horizontal") {
    userPref.horizontal = true;
    userPref.vertical = undefined;
  }

  let qid = req.params.qid;
  qid = parseInt(qid);

  //if last page
  if(qid > questions.length)

  // default rendering
  let render = {
    title: "Question No.",
    username: req.body.username,
    qid: qid,
    question: questions[qid - 1].question,
    options: questions[qid - 1].options,
    prefv: userPref.vertical,
    prefh: userPref.horizontal,
    //TODO
  };
  res.render("question", {
    title: render.title,
    username: render.username,
    qid: render.qid,
    question: render.question,
    options: render.options,
    prefv: render.prefv,
    prefh: render.prefh,
  });
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
