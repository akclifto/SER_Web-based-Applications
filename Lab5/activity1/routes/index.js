const express = require("express");
const router = express.Router();

const fileService = require("../services/fileService");
const logger = require("../services/log");

let history = [];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.post("/euro", async function (req, res, next) {
  //TODO
  let flag;
  let userAgent = req.header["user-agent"];
  let ip = req["_remoteAddress"];
  let usd = req.body.usd;
  let conv = 0.84;
  const euro = conv * usd;
  let operand = `Operand: ${usd} was convert from USD to ${euro}, IP: ${ip}, User-Details: ${userAgent}`;
  history.push(operand);

  let response = {
    euro: `${euro} in EURO`,
    userAgent: userAgent,
    ip: ip,
    activity: history,
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

router.post("/pound", async function (req, res, next) {
  //TODO
  let flag;
  let userAgent = req.header["user-agent"];
  let ip = req["_remoteAddress"];
  let usd = req.body.usd;
  let conv = 0.73;
  const pound = conv * usd;
  let operand = `Operand: ${usd} was convert from USD to ${pound}, IP: ${ip}, User-Details: ${userAgent}`;
  history.push(operand);

  let response = {
    pound: `${pound} in POUND`,
    userAgent: userAgent,
    ip: ip,
    activity: history,
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

router.get("/pop", function (req, res, next) {
  //TODO
});

router.get("/reset", function (req, res, next) {
  //TODO
});

router.get("/history", function (req, res, next) {
  //TODO
});

module.exports = router;
