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
router.get("/match", (req, res, next) => {
  let username = req.session.username;
  logger.serverLog(`Rendering matches for user: ${username}`);
  let title = "Matches";
  let subTitle = "Here is a list of your potential roommate matches: ";
  let matches = [];
  res.render("match", { title, subTitle, matches, username });
});

module.exports = router;
