/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();

const logger = require("../services/log");
const fileService = require("../services/fileService");
const { match } = require("assert");

/**
 * GET '/' landing page.
 */
router.get("/", (req, res, next) => {
  //create a user answers file.
  req.session.userAnswers = [];
  const title = "Roommate Finder";
  const subTitle = "Welcome, Get Started Here!";
  const startMessage = "Put in your name, and click match:";
  res.render("index", {
    title,
    subTitle,
    startMessage,
  });
});

/**
 * GET '/preferences/:qid to handle display preference for given qid.
 */
router.get("/preferences/:qid", (req, res, next) => {
  let username = req.session.username;
  logger.serverLog(`Rendering preferences for user: ${username}`);
  let qid = req.params.qid;
  let title = "Select your display preferences.";
  res.render("preferences", { title, qid, username });
});

/**
 * GET '/match' page to display survey matches.
 */
router.get("/match", async (req, res, next) => {
  const username = req.session.username;
  const userAnswers = req.session.userAnswers;
  // console.log(userAnswers);
  try {
    let allAnswers = await fileService.getAnswers(res);
    if (allAnswers === "empty") {
      allAnswers = [];
    }
    let match = await getMatchResults(username, userAnswers, allAnswers);
    console.log("promise matches: ", match);
    let matches = [];
    let user = 0;
    for (let i in match) {
      let entry = {
        username: Object.keys(match)[user],
        count: match[i],
      };
      matches.push(entry);
      user++;
    }
    let message = "";
    if (matches.length === 0) {
      message = "You have no matches at this time :(";
    }
    logger.serverLog(`Rendering matches for user: ${username}`);
    let title = "Matches";
    let subTitle = "Here is a list of your potential roommate matches: ";
    res.render("match", { title, subTitle, matches, username, message });
  } catch (err) {
    let error = logger.setErrorMessage(500, err.message);
    res.render("error", { error });
  }
});

/**
 * Function to get Match results after user survey answered.
 * @param {*} username : name of user
 * @param {*} userAnswers : user answers
 * @param {*} allAnswers : all answers in system
 * @returns promise with matches and count.
 */
function getMatchResults(username, userAnswers, allAnswers) {
  return new Promise((resolve, reject) => {
    try {
      let matches = {};
      for (let i = 0; i < allAnswers.length; i++) {
        for (let j = 0; j < userAnswers.length; j++) {
          if (
            userAnswers[j].qid === allAnswers[i].qid &&
            userAnswers[j].answer === allAnswers[i].answer &&
            username !== allAnswers[i].username
          ) {
            if (matches[allAnswers[i].username]) {
              matches[allAnswers[i].username]++;
            } else {
              matches[allAnswers[i].username] = 1;
            }
          }
        }
      }
      // console.log("tallyMatch func: ", matches);
      resolve(matches);
    } catch (err) {
      logger.errorLog("getMatchResults", err);
      reject(false);
    }
  });
}

module.exports = router;
