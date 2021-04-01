/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authenticate");
const logger = require("../services/log");

router.all("/", function (req, res, next) {
  let title = "Admin Login";
  let subTitle = "Login Page";
  let startMessage = "Please login for to manage site:";
  res.render("admin", { title, subTitle, startMessage });
});

router.post("/manage", async (req, res, next) => {
  console.log(req.body);
  try {
    let flag = await auth(req.body.userLogin, req.body.userPassword);
    if (flag) {
      req.session.adminPriv = true;
      let title = "Admin Management";
      let subTitle = "Manage match questions"
      res.render("manage", { title, subTitle });
    } else {
      let title = "Admin Login";
      let subTitle = "Login Page";
      let startMessage = "Please login for to manage site:";
      let errorMessage = "Invalid username/password combination, please try again.";
      res.render("admin", { title, subTitle, startMessage, errorMessage });
    }
  } catch (err) {
    let error = logger.setErrorMessage(401, err.message);
    res.render("error", { error });
  }
});

module.exports = router;
