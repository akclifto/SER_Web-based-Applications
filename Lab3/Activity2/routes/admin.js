/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authenticate");

router.all("/", function (req, res, next) {
  let title = "Admin Login";
  let subTitle = "Login Page";
  let startMessage = "Please login for to manage site:";
  let errorMessage = "Invalid username/password combination, please try again.";
  res.render("admin", { title, subTitle, startMessage, errorMessage });
});

router.post("/manage", async (req, res, next) => {
  console.log(req.body);
  auth(req.body.userLogin, req.body.userPassword);
});

module.exports = router;
