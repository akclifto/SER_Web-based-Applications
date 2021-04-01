/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
// const mongo = require("../db/mongo");
const fileService = require("../services/fileService");
const paths = require("../services/constants");
const logger = require("../services/log");

//timeout vars
let redirect = false;
let redirectStart = false;
let timeout;

/**
 * ALL '/' redirect to first question page
 */
router.get("/", (req, res, next) => {
  logger.serverLog('redirect "/question" page to "question/1"');
  let error = logger.setErrorMessage(
    401,
    "Please enter username before taking the match survey"
  );
  res.render("error", { error });
});

/**
 * GET 'reset/a' to handle a stop mid survey. Resets timeouts and sends
 * user to landing page.
 */
router.get("/reset/a", (req, res, next) => {
  logger.serverLog(
    "Resetting timers and ending session, redirect to main page."
  );
  redirect = false;
  redirectStart = false;
  clearTimeout(timeout);
  req.session.destroy();
  res.redirect("/");
});

/**
 * ALL '/:qid' by question id
 */
router.all("/:qid", async (req, res, next) => {
  if (req.url === "/reset") {
    res.redirect("/question/reset/a");
  }
  // logger.serverLog("Questions page, id: " + req.params.qid);
  // console.log(req.session.adminPriv);
  else if (req.session.adminPriv) {
    const adminPriv = true;
    let error = logger.setErrorMessage(
      403,
      "Site administrators cannot take the match survey.  Please logout first."
    );
    res.render("error", { error, adminPriv });
  } else if (redirect) {
    logger.serverLog(
      `Session timed out, ending session for user: ${req.session.username}`
    );
    redirect = false;
    redirectStart = false;
    logger.serverLog(
      `Resetting redirects, redirect starter status: ${redirectStart}, redirect active status: ${redirect}`
    );
    req.session.destroy();
    res.redirect(307, "/");
  } else {
    //set redirect timeout
    setTimedRedirect();
    // add the username to the session.
    try {
      if (req.session.username === undefined) {
        req.session.username = req.body.username;
      }
      let questions = await fileService.getQuestions(res);
      getDisplayPrefs(req);
      let qid = req.params.qid;
      qid = parseInt(qid);
      //check query options for answers
      if (req.query.option !== undefined) {
        let flag = await saveAnswer(req, qid, questions);
        if (!flag) {
          logger.errorLog(`Question ${qid}`, "User Answer could not be saved.");
        }
      }
      let message = "";
      if (questions === "empty") {
        message = "No Questions found";
        questions = { emptyMessage: message };
      }
      /* SAVE ANSWER */
      //if last page, direct to match page
      if (qid > questions.length) {
        let allAnswers = await fileService.getAnswers(res);
        if (allAnswers === "empty") {
          allAnswers = [];
        }
        //check dup usernames
        let dupFlag = false;
        for (let i = 0; i < allAnswers.length; i++) {
          if (req.session.username === allAnswers[i].username) {
            logger.serverLog(
              `User ${req.session.username} answer duplicates found. Replacing...`
            );
            dupFlag = true;
            allAnswers.splice(i, 1);
          }
          if (dupFlag) {
            i -= 1;
            dupFlag = false;
          }
        }
        for (let i in req.session.userAnswers) {
          allAnswers.push(req.session.userAnswers[i]);
        }
        let flag = await fileService.writeToFile(
          res,
          paths.ANSWERS_JSON,
          allAnswers
        );
        if (flag) {
          logger.serverLog(
            `User ${req.session.username}'s answers saved to file`
          );
          // go to match page
          res.redirect("/match");
        } else {
          let error = logger.setErrorMessage(
            500,
            `User ${req.session.username}'s answer's could not be saved.`
          );
          res.render("error", { error });
        }
      } else {
        // check returning user and pre-populatea answers
        let prepop = [];
        try {
          prepop = await checkReturningUser(req, res, qid);
        } catch (err) {
          logger.serverLog(`No Prepop, promise returned: ${err}`);
        }
        let answer = "";
        // console.log(prepop);
        if (prepop.length !== 0) {
          answer = prepop[0].answer;
        } else {
          // if no prepop, collect user answer
          if (req.session.userAnswers.length > 0) {
            if (qid === 1 || req.query.prev !== undefined) {
              answer = req.session.userAnswers[qid - 1].answer;
            } else {
              for (let item in req.session.userAnswers) {
                if (qid === req.session.userAnswers[item].qid) {
                  answer = req.session.userAnswers[item].answer;
                }
              }
            }
          }
        }
        // to use as db object if trying mongodb.
        let render = {
          title: "Question No.",
          username: req.session.username,
          emptyMessage: message,
          qid: qid,
          question: questions[qid - 1].question,
          options: questions[qid - 1].options,
          prefh: req.session.pref,
          answer: answer,
        };
        // default rendering
        res.render("question", {
          title: render.title,
          emptyMessage: render.emptyMessage,
          username: render.username,
          qid: render.qid,
          question: render.question,
          options: render.options,
          prefh: render.prefh,
          userAnswer: render.answer,
        });
      }
    } catch (err) {
      logger.errorLog("question/:qid", err);
      let error = logger.setErrorMessage(500, err);
      res.render("error", { error });
    }
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
          logger.serverLog(
            `There was previous user answer match, replacing user answer for id: ${qid}`
          );
          req.session.userAnswers.splice(item, 1);
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
  //check prev query
  // console.log("prev value: ", req.query.prev);
  if (req.query.prev !== undefined) {
    logger.serverLog("Skipping check validation, prev selected.");
    return new Promise(function (resolve, reject) {
      try {
        let answer = {
          username: req.session.username,
          qid: qid + 1,
          question: questions[qid].question,
          answer: req.query.option,
        };
        // push answer to res.session.userAnswers
        req.session.userAnswers.push(answer);
        // console.log("saved user answers: ", req.session.userAnswers);
        resolve(true);
      } catch (err) {
        logger.errorLog("saveAnswer", err);
        reject(false);
      }
    });
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
          // console.log(req.session.userAnswers.length);
          req.session.userAnswers.push(answer);
          // console.log("saved user answers: ", req.session.userAnswers);
          resolve(true);
        } catch (err) {
          logger.errorLog("saveAnswer", err);
          reject(false);
        }
      });
    }
  }
}

async function checkReturningUser(req, res, qid) {
  try {
    let answers = await fileService.getAnswers(res);
    let username = req.session.username;
    let prepop = [];
    return new Promise((resolve, reject) => {
      answers.forEach((ans) => {
        if (username === ans.username && qid === ans.qid) {
          prepop.push(ans);
          // console.log(prepop);
          resolve(prepop);
        }
      });
      reject(false);
    });
  } catch (err) {
    logger.errorLog("checkReturningUser", err);
  }
}

/**
 * Method to set redirect timer
 * @param {*} req : request object
 * @param {*} res : server response
 */
function setTimedRedirect() {
  const redirectTime = 30000; //30 seconds
  if (redirectStart) {
    // do nothing
    logger.serverLog(`Redirect timeout is active, status: ${redirectStart}`);
  } else {
    redirectStart = true;
    logger.serverLog(`Redirect timeout set, status: ${redirectStart}`);
    timeout = setTimeout(() => {
      // console.log("time going off.");
      setRedirect();
    }, redirectTime);
  }
}

/**
 * Method to redirect page after timer expires.
 * @param {*} req : request object
 */
function setRedirect() {
  redirect = true;
}

module.exports = router;
