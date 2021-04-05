const fs = require("fs");
const path = require("path");

const logger = require("./log");

const FILE_DIR = path.resolve();
const REVIEW_JSON = "/resource/review.json";
const DICTIONARY_JSON = "/resource/dictionary.json";

/**
 * Method to get critic review. Reads reivew file from resource folder.
 * @returns parsed json review in Promise, rejects false otherwise.
 */
function getReview() {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(FILE_DIR.concat(REVIEW_JSON), "UTF-8", function (err, data) {
        if (err) {
          logger.errorLog("readFile", err);
          reject(false);
        }

        let review = JSON.parse(data);
        if (review.length === 0 || review === "") {
          resolve(false);
        } else {
          resolve(review);
        }
      });
    } catch (err) {
      logger.errorLog("getReview", err);
    }
  });
}

/**
 * Method to get dictionary. Reads dictionary file from resource folder.
 * @returns parsed json dictionary in Promise, rejects false otherwise.
 */
function getDictionary() {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(
        FILE_DIR.concat(DICTIONARY_JSON),
        "UTF-8",
        function (err, data) {
          if (err) {
            logger.errorLog("readFile", err);
            reject(false);
          }

          let dictionary = JSON.parse(data);
          if (dictionary.length === 0 || dictionary === "") {
            resolve(false);
          } else {
            resolve(dictionary);
          }
        }
      );
    } catch (err) {
      logger.errorLog("getDictionary", err);
    }
  });
}

module.exports = {
  getReview,
  getDictionary,
};
