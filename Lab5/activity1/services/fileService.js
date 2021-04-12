const path = require("path");
const fs = require("fs");

const logger = require("../services/log");

const FILE_DIR = path.resolve();
const HISTORY = "../resource/history.json";

/**
 * Method to write data to file.
 * @param {*} res : server response
 * @param {*} file : file to write
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

module.exports = {
  writeToFile,
};
