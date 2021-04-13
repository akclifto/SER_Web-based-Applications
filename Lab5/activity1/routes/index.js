/* eslint-disable no-unused-vars */
const express = require("express");
const router = express.Router();

const fileService = require("../services/fileService");
const logger = require("../services/log");

let history = [];

/**
 * GET home page.
 * */
router.get("/", function (req, res, next) {
  res.render("index");
});

/**
 * GET API documentation page.
 */
router.get("/api", function (req, res, next) {
  res.sendFile(fileService.API);
});

router.get("/api_s", async (req, res, next) => {
  let api;
  try {
    api = await fileService.getAPI();
  } catch (err) {
    logger.errorLog("api_s", err);
  }
  let response = { api };
  res.set({
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    Accept: "application/json",
  });
  res.send(response);
});

/**
 * POST euro api conversion.
 */
router.post("/euro", function (req, res, next) {
  let conversionType = "euro";
  handleConversion(req, res, conversionType);
});

/**
 * POST pound api conversion.
 */
router.post("/pound", function (req, res, next) {
  let conversionType = "pound";
  handleConversion(req, res, conversionType);
});

/**
 * GET pop api action.  Pops last item from history.
 */
router.get("/pop", async function (req, res, next) {
  try {
    history = await fileService.getHistory();
  } catch (err) {
    logger.errorLog("pop read", err);
  }
  if (history.length === 0 || history === "") {
    history = [];
  }
  let popped;
  let flag;
  try {
    popped = history.pop();
    flag = await fileService.writeToFile(history);
  } catch (err) {
    logger.errorLog("pop write", err);
  }
  if (flag) {
    let response = { history, popped };
    res.set({
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      Accept: "application/json",
    });
    res.send(response);
  }
});

/**
 * GET reset api action. Resets history.
 */
router.get("/reset", async function (req, res, next) {
  let flag;
  history = [];
  try {
    flag = await fileService.writeToFile(history);
  } catch (err) {
    logger.errorLog("reset", err);
  }
  if (flag) {
    let response = { history };
    res.set({
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      Accept: "application/json",
    });
    res.send(response);
  }
});

/**
 * GET history api action.  Shows activity history.
 */
router.get("/history", async function (req, res) {
  try {
    history = await fileService.getHistory();
  } catch (err) {
    logger.errorLog("history", err);
  }
  if (history.length === 0 || history === "") {
    history = [];
  }
  let response = { history };
  res.set({
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    Accept: "application/json",
  });
  res.send(response);
});

/**
 * Method to handle Conversions for Euros and Pounds.  Sends response object
 * to client.
 * @param {*} req :req object
 * @param {*} res : response object
 * @param {*} conversionType : conversion type (euros || pounds)
 */
async function handleConversion(req, res, conversionType) {
  let flag;
  let userAgent = req.headers["user-agent"];
  let ip = req["_remoteAddress"];
  let usd = req.body.usd;
  let conv = "";
  let converted = "";
  if (conversionType === "euro") {
    conv = 0.9;
    converted = parseFloat(conv * usd).toFixed(2);
    converted = `\u20AC ${converted} in EUROS`;
    let operand = `Operand: ${usd} was converted from USD to ${converted}, IP: ${ip}, User-Details: ${userAgent}`;
    history.push(operand);
  } else {
    conv = 0.78;
    converted = parseFloat(conv * usd).toFixed(2);
    converted = `&#163 ${converted} in POUNDS`;
    let operand = `Operand: ${usd} was converted from USD to ${converted}, IP: ${ip}, User-Details: ${userAgent}`;
    history.push(operand);
  }
  let response = {
    converted: converted,
    userAgent: userAgent,
    ip: ip,
    history: history,
  };
  try {
    flag = await fileService.writeToFile(history);
  } catch (err) {
    logger.errorLog("handleConversion", err);
  }
  if (flag) {
    res.set({
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      Accept: "application/json",
    });
    res.send(response);
  }
}

module.exports = router;
