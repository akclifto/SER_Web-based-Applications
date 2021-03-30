/* eslint-disable no-unused-vars */
const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const logger = require("../middleware/log");

const FILE_DIR = path.resolve();

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

router.get("/preferences", (req, res, next) => {
  //TODO qid is undefined
  let qid = req.params.qid;
  let title = "Select your display preferences.";
  res.render("preferences", { title });
});

router.get("/match", (req, res, next) => {
  let title = "Matches";
  let subTitle = "Here is a list of your potential roommate matches:"
  let matches = [];
  res.render("match", { title, subTitle, matches });
});

/**
 * Method to write data to file.
 * @param {*} res : server response
 * @param {*} file : file to write
 * @param {*} data : data to write to file
 */
function writeToFile(res, file, data) {
  try {
    fs.writeFileSync(
      FILE_DIR.concat(file),
      JSON.stringify(data),
      "UTF8",
      function (err) {
        if (err) {
          let error = logger.setErrorMessage(500, err.message);
          res.render("error", { error });
        }
      }
    );
  } catch (err) {
    logger.errorLog("WriteToFile", err);
  }
}

module.exports = router;
