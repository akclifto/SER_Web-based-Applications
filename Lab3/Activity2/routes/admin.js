/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authenticate");
const logger = require("../services/log");
const fileService = require("../services/fileService");

router.all("/", function (req, res, next) {
  let title = "Admin Login";
  let subTitle = "Login Page";
  let startMessage = "Please login for to manage site:";
  res.render("admin", { title, subTitle, startMessage });
});

router.post("/manage", async (req, res, next) => {
  // console.log(req.body);
  try {
    let flag = await auth(req.body.userLogin, req.body.userPassword);
    if (flag) {
      req.session.adminPriv = true;
      let questions = await fileService.getQuestions(res);
      // console.log(questions);
      let title = "Admin Management";
      let subTitle = "Manage match questions";
      let questionTitle = "Current list of questions:";
      res.render("manage", { title, subTitle, questions, questionTitle });
    }
  } catch (err) {
    logger.serverLog(
      `Promise was rejected status: ${err}, for unauthorized login credentials.`
    );
    let title = "Admin Login";
    let subTitle = "Login Page";
    let startMessage = "Please login for to manage site:";
    let errorMessage =
      "Invalid username/password combination, please try again.";
    res.render("admin", { title, subTitle, startMessage, errorMessage });
  }
});

module.exports = router;
