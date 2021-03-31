/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();

const logger = require("../services/log");

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
  try {
    let matches = await getMatchResults(userAnswers, username);
    console.log(matches);
    logger.serverLog(`Rendering matches for user: ${username}`);
    let title = "Matches";
    let subTitle = "Here is a list of your potential roommate matches: ";
    res.render("match", { title, subTitle, matches, username });
  } catch (err) {
    let error = logger.setErrorMessage(500, err.message);
    res.render("error", { error });
  }
});

function getMatchResults(answers, username) {
  return new Promise((resolve, reject) => {
    console.log(answers);
    // read in answer file
    // for each
    // check user answers and against all asnwers in file
    // if user answer equals answer in answer file and username != userAnswers username
    // then save answer username, count + 1.
    //
  });
}

module.exports = router;
