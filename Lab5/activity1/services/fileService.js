const path = require("path");
const fs = require("fs");

const logger = require("../services/log");

const FILE_DIR = path.resolve();
const HISTORY = "/resource/history.json";

/**
 * Method to write data to file.
 * @param {*} data : data to write to file
 */
function writeToFile(data) {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(
        FILE_DIR.concat(HISTORY),
        JSON.stringify(data),
        "UTF8",
        function (err) {
          if (err) {
            logger.errorLog("WriteToFile", err);
            reject(false);
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
 * Method to get history. Reads history file from resource folder.
 * @returns parsed json questions in Promise, rejects otherwise.
 */
function getHistory() {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(FILE_DIR.concat(HISTORY), "UTF8", function (err, data) {
        if (err) {
          logger.errorLog("readFile", err);
          reject(false);
        }
        let history = JSON.parse(data);
        if (history.length === 0 || history === "") {
          history = [];
          resolve(history);
        } else {
          resolve(history);
        }
      });
    } catch (err) {
      logger.errorLog("getArticle error: ", err);
    }
  });
}

module.exports = {
  writeToFile,
  getHistory,
};
