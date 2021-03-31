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
  // add the username to the session.
  if (req.session.username === undefined) {
    req.session.username = req.body.username;
  }
  // console.log(req.session.userAnswers);
  // TODO fix not working
  let questions = await fileService.getQuestions(res);
  getDisplayPrefs(req);
  let qid = req.params.qid;
  qid = parseInt(qid);
  //check query options for answers
  console.log(req.query);
  if (req.query.option !== undefined) {
    let flag = await saveAnswer(req, qid, questions);
    if (!flag) {
      logger.errorLog(`Question ${qid}`, "User Answer could not be saved.");
    }
  }
  //TODO check next and prev values before saving

  let message = "";
  if (questions === "empty") {
    message = "No Questions found";
    questions = { emptyMessage: message };
  }

  //if last page, direct to match page
  if (qid > questions.length) {
    console.log("questions userAnswers: ", req.session.userAnswers);
    res.redirect("/match");
  } else {
    // to use as db object if trying mongodb.
    let render = {
      title: "Question No.",
      username: req.session.username,
      qid: qid,
      question: questions[qid - 1].question,
      options: questions[qid - 1].options,
      prefh: req.session.pref,
    };
    // default rendering
    res.render("question", {
      title: render.title,
      username: render.username,
      qid: render.qid,
      question: render.question,
      options: render.options,
      prefh: req.session.pref,
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
    req.session.pref = req.body.display;
  } else {
    req.session.pref = "vertical";
  }
}

/**
 * Method to check and replace duplicate answers.
 * @param {*} req : request object
 * @param {*} qid : question id
 * @returns promise true if splice or no dups, false otherwise
 */
function checkAnswer(req, qid) {
  return new Promise(function (resolve, reject) {
    try {
      for (let item in req.session.userAnswers) {
        // console.log(
        //   `qid: ${qid} answer id:${req.session.userAnswers[item].qid}`
        // );
        if (qid === req.session.userAnswers[item].qid) {
          console.log("There was a match, splicing user answers.");
          req.session.userAnswers.splice(item, 1);
          resolve(true);
        }
      }
      resolve(true);
    } catch (err) {
      logger.errorLog("saveAnswer", err);
      reject(false);
    }
  });
}

/**
 * Method to push answers to the userAnswers session object.
 * @param {*} req : request object.
 * @param {*} qid : question id.
 * @param {*} questions : questions objects
 * @returns Promise true if save was successful, false otherwise.
 */
async function saveAnswer(req, qid, questions) {
  // console.log(req.query);
  // console.log(req.session.userAnswers);
  //check prev query
  if (req.query.prev !== undefined) {
    // console.log(req.query);
    let flag = await checkAnswer(req, qid);
    if (flag) {
      return new Promise(function (resolve, reject) {
        try {
          let answer = {
            username: req.session.username,
            qid: qid,
            question: questions[qid - 1].question,
            answer: req.query.option,
          };
          // push answer to res.session.userAnswers
          req.session.userAnswers.push(answer);
          console.log(req.session.userAnswers);
          resolve(true);
        } catch (err) {
          logger.errorLog("saveAnswer", err);
          reject(false);
        }
      });
    }
  } else {
    let flag = await checkAnswer(req, qid - 1);
    if (flag) {
      return new Promise(function (resolve, reject) {
        try {
          let answer = {
            username: req.session.username,
            qid: qid - 1,
            question: questions[qid - 2].question,
            answer: req.query.option,
          };
          // push answer to res.session.userAnswers
          req.session.userAnswers.push(answer);
          console.log(req.session.userAnswers);
          resolve(true);
        } catch (err) {
          logger.errorLog("saveAnswer", err);
          reject(false);
        }
      });
    }
  }
}

module.exports = router;
