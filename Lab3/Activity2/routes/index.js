/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();

const logger = require("../services/log");

/**
 * GET '/' landing page with async callback.
 */
router.get("/", async function (req, res, next) {
  const title = "Roommate Finder";
  const subTitle = "Welcome, Get Started Here!";
  const startMessage = "Put in your name, and click match:";
  res.render("index", {
    title,
    subTitle,
    startMessage,
  });
});

router.get("/preferences/:qid", (req, res, next) => {
  let qid = req.params.qid;
  let title = "Select your display preferences.";
  res.render("preferences", { title, qid });
});

router.get("/match", (req, res, next) => {
  let title = "Matches";
  let subTitle = "Here is a list of your potential roommate matches: ";
  let matches = [];
  res.render("match", { title, subTitle, matches });
});

module.exports = router;
