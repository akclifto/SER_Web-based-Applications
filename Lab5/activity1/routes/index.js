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
router.post("/euro", async function (req, res, next) {
  let flag;
  let userAgent = req.headers["user-agent"];
  let ip = req["_remoteAddress"];
  let usd = req.body.usd;
  console.log(req.body);
  let conv = 0.84;
  const euro = conv * usd;
  let operand = `Operand: ${usd} was converted from USD to ${euro} EUROS, IP: ${ip}, User-Details: ${userAgent}`;
  history.push(operand);

  let response = {
    conv: `\u20AC${euro} in EUROS`,
    userAgent: userAgent,
    ip: ip,
    history: history,
  };
  try {
    flag = await fileService.writeToFile(response);
  } catch (err) {
    logger.errorLog("euro", err);
  }
  if (flag) {
    res.set({
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      Accept: "application/json", //TODO
    });
    res.send(response);
  }
});

/**
 * POST pound api conversion.
 */
router.post("/pound", async function (req, res, next) {
  let flag;
  let userAgent = req.header["user-agent"];
  let ip = req["_remoteAddress"];
  let usd = req.body.usd;
  let conv = 0.73;
  const pound = conv * usd;
  let operand = `Operand: ${usd} was converted from USD to ${pound} GBP, IP: ${ip}, User-Details: ${userAgent}`;
  history.push(operand);

  let response = {
    pound: `${pound} in POUNDS`,
    userAgent: userAgent,
    ip: ip,
    history: history,
  };
  try {
    flag = await fileService.writeToFile(history);
  } catch (err) {
    logger.errorLog("euro", err);
  }
  if (flag) {
    res.set({
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      Accept: "application/json", //TODO
    });
    res.send(response);
  }
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
router.get("/reset", function (req, res, next) {
  //TODO
});

/**
 * GET history api action.  Shows activity history.
 */
router.get("/history", function (req, res, next) {
  //TODO
});

module.exports = router;
