/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const url = "mongodb://localhost:27017";

// router.all("/", (req, res, next) => {
//   console.log("Hit the questions page");
//

//   next();
// });

router.all("/:qid", async (req, res, next) => {
  console.log("hit the id " + req.params.qid);

  let questions = await getQuestions(res);
  // res.render("question", { title: "The question page" });
});


/**
 * Method to get comments. Reads comment file from resource folder.
 * @param {*} res : server response
 * @returns parsed json comments.
 */
 function getQuestions(res) {
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(FILE_DIR.concat(COMMENTS_JSON), "UTF8", function (err, data) {
        if (err) {
          errorLog("readFile", err);
          let error = setErrorMessage(500, err.message);
          // render the pug error template
          reject(res.render("error", { error }));
        }

        let comments = JSON.parse(data);
        if (comments.length === 0 || comments === "") {
          // set an initial, blank comment.
          resolve("empty");
        } else {
          // console.log(data);
          resolve(comments);
        }
      });
    } catch (err) {
      errorLog("getArticle error: ", err);
    }
  });
}


module.exports = router;
