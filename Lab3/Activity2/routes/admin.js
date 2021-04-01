/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  let title = "Admin Login";
  let subTitle = "Login Page";
  let startMessage = "Please login for to manage site:";
  res.render("admin", { title, subTitle, startMessage });
});

module.exports = router;
