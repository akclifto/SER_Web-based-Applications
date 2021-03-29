/* eslint-disable no-unused-vars */
const express = require("express");
let router = express.Router();

// router.all("/", (req, res, next) => {
//   console.log("Hit the questions page");
//

//   next();
// });

router.all("/:qid", (req, res, next) => {
  console.log("hit the id " + req.params.qid);
  res.render("question", { title: "The question page" });
});

module.exports = router;
