/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const fs = require("fs");
// const mongo = require("../db/mongo");
const fileService = require("../services/fileService");
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
  let questions = await fileService.getQuestions(res);

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
  console.log(questions.length);
  console.log(qid);
  // direct to matchs page
  if (qid > questions.length) {
    let user = {
      username: req.body.username,
    };
    res.redirect("/match");
  } else {
    let render = {
      title: "Question No.",
      username: req.body.username,
      qid: qid,
      question: questions[qid - 1].question,
      options: questions[qid - 1].options,
      prefv: userPref.vertical,
      prefh: userPref.horizontal,
    };
    // default rendering
    res.render("question", {
      title: render.title,
      username: render.username,
      qid: render.qid,
      question: render.question,
      options: render.options,
      prefv: render.prefv,
      prefh: render.prefh,
    });
  }
});

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
