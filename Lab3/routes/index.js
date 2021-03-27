/* eslint-disable no-unused-vars */
let express = require("express");
let fs = require("fs");
let path = require("path");
let router = express.Router();

const FILE_DIR = path.resolve();

/* GET home page. */
router.get("/", function (req, res, next) {
  let article = "";

  fs.readFile(
    FILE_DIR.concat("/resource/article.txt"), "UTF8", function (err, data) {
      if (err) {
        console.log("readFile error: ", err);
      }
      // article = data;
      // console.log(article);
      return data;
    }
  );
  
  let title = "Sample of Article: ";
  //render the article to articleBody
  res.render("index", {
    title: "Welcome to the Article Reviewer App",
    articleTitle: title,
    articleBody: article.toString(),
  });
});

module.exports = router;
