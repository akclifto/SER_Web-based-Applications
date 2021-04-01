/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authenticate");
const logger = require("../services/log");
const paths = require("../services/constants");
const fileService = require("../services/fileService");
const session = require("express-session");

/**
 * ALL '/admin' to handle admin login
 */
router.all("/", function (req, res, next) {
  let title = "Admin Login";
  let subTitle = "Login Page";
  let startMessage = "Please login to manage site:";
  res.render("admin", { title, subTitle, startMessage });
});

/**
 * POST '/manage' to handle landing page for admin.
 */
router.post("/manage", async (req, res, next) => {
  // console.log(req.body);
  try {
    let flag = await auth(req.body.userLogin, req.body.userPassword);
    if (flag) {
      req.session.adminPriv = true;
      const questions = await fileService.getQuestions(res);
      // console.log(questions);
      const title = "Admin Management";
      const subTitle = "Manage match questions";
      const questionTitle = "Current list of questions:";
      res.render("manage", { title, subTitle, questions, questionTitle });
    }
  } catch (err) {
    logger.serverLog(
      `Promise was rejected status: ${err}, for unauthorized login credentials.`
    );
    const title = "Admin Login";
    const subTitle = "Login Page";
    const startMessage = "Please login to manage site:";
    const errorMessage =
      "Invalid username/password combination, please try again.";
    res.render("admin", { title, subTitle, startMessage, errorMessage });
  }
});

/**
 * GET '/manage' handle unauthorized.
 */
router.get("/manage", (req, res) => {
  let error = logger.setErrorMessage(
    401,
    "Access unauthorized. Please login to manage site."
  );
  res.render("error", { error });
});

/**
 * GET '/manage/q' handle unauthorized.
 */
router.get("/manage/q", (req, res) => {
  let error = logger.setErrorMessage(
    401,
    "Access unauthorized. Please login to manage site."
  );
  res.render("error", { error });
});

/**
 * POST '/manage/q pages to handle adding a question to the match survey.
 */
router.post("/manage/q", async (req, res, next) => {
  // add a question using the text inputs
  // console.log(req.body);
  let options;
  let questions = await fileService.getQuestions(res);
  try {
    let question = req.body.questionText;
    let options = await getQuestionOptions(req.body.optionText);
    // console.log(options);
    let qid = 0;
    questions.forEach((q) => {
      if (q.qid > qid) {
        qid = q.qid;
      }
    });
    qid = parseInt(qid) + 1;
    // console.log(qid);
    const newQuestion = {
      qid: qid,
      question: question,
      options: options,
    };
    questions.push(newQuestion);
    let flag = await fileService.writeToFile(
      res,
      paths.QUESTIONS_JSON,
      questions
    );
    if (flag) {
      const title = "Admin Management";
      const subTitle = "Manage match questions";
      const questionTitle = "Current list of questions:";
      res.render("manage", {
        title,
        subTitle,
        questions,
        questionTitle,
      });
    } else {
      let error = logger.setErrorMessage(500, "Could not add new question");
      res.render("error", { error });
    }
  } catch (err) {
    if (!options) {
      const title = "Admin Management";
      const subTitle = "Manage match questions";
      const questionTitle = "Current list of questions:";
      const errorMessage = `You must add more than one answer option. Ex: "Yes,No".`;
      res.render("manage", {
        title,
        subTitle,
        questions,
        questionTitle,
        errorMessage,
      });
    } else {
      logger.errorLog("manage/q", err);
    }
  }
});

/**
 * ALL '/admin' to handle admin logout
 */
router.all("/logout", (req, res) => {
  // console.log(req.session.adminPriv);
  logger.serverLog(`Logging out admin user...`);
  req.session.adminPriv = false;
  res.redirect("/");
});

/**
 * Method to parse answer options from addQuestion form.
 * @param {*} options : options to parse
 * @returns : Promise of parsed options, reject false otherwise.
 */
function getQuestionOptions(options) {
  return new Promise((resolve, reject) => {
    let opts = options.split(",");
    if (opts.length < 2) {
      reject(false);
    }
    for (let i = 0; i < opts.length; i++) {
      opts[i] = opts[i].trim();
    }
    resolve(opts);
  });
}

module.exports = router;
