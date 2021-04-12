const e = require("express");
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
router.get("/pop", function (req, res, next) {
  //TODO
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
router.get("/history", async function (req, res, next) {
  try {
    history = await fileService.getHistory();
  } catch (err) {
    logger.errorLog("history", err);
  }
  if (history.length === 0 || history === "") {
    history = ["No History Found"];
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
    converted = `\u20AC ${conv * usd} in EUROS`;
    let operand = `Operand: ${usd} was converted from USD to ${converted}, IP: ${ip}, User-Details: ${userAgent}`;
    history.push(operand);
  } else {
    conv = 0.78;
    converted = `&#163 ${conv * usd} in POUNDS`;
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
