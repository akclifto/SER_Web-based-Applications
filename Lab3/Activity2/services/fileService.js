const fs = require("fs");

const paths = require("./constants");
const logger = require("./log");

/**
 * File Service to manage reading and writing files.
 */

/**
 * Method to write data to file.
 * @param {*} res : server response
 * @param {*} file : file to write
 * @param {*} data : data to write to file
 */
function writeToFile(res, file, data) {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(
        paths.FILE_DIR.concat(file),
        JSON.stringify(data),
        "UTF8",
        function (err) {
          if (err) {
            let error = logger.setErrorMessage(500, err.message);
            res.render("error", { error });
          }
        }
      );
      resolve(true);
    } catch (err) {
      logger.errorLog("WriteToFile", err);
      reject(false);
    }
  });
}

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

module.exports = {
  writeToFile,
  getQuestions,
};
