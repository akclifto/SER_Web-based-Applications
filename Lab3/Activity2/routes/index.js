/* eslint-disable no-unused-vars */
const { FILE } = require("dns");
let express = require("express");
let fs = require("fs");
let path = require("path");
let router = express.Router();

const FILE_DIR = path.resolve();

/**
 * GET '/' landing page with async callback.
 */
router.get("/", async function (req, res, next) {
  //TODO
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
          let error = setErrorMessage(500, err.message);
          res.render("error", { error });
        }
      }
    );
  } catch (err) {
    errorLog("WriteToFile", err);
  }
}

/**
 * Method to handle error messaging for error pug
 * @param {*} statusCode : status code of error
 * @param {*} errorMessage : message of error
 * @returns : object containing error
 */
function setErrorMessage(statusCode, errorMessage) {
  let error = {
    status: statusCode,
    message: errorMessage,
  };
  return error;
}

/**
 * Method to normalize error logs from server.
 * @param {*} location : location of the error
 * @param {*} err : error message and stacktrace to log
 */
function errorLog(location, err) {
  console.log("ErrorLog: ", location, ": ", err);
}

/**
 * Method to normalize server logs.
 * @param {*} message : message to log
 */
function serverLog(message) {
  console.log("Server: ", message);
}

module.exports = router;
