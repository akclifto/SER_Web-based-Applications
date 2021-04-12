const express = require("express");
const router = express.Router();

const fileService = require("../services/fileService");
const logger = require("../services/log");


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

router.post("/euro", function (req, res, next) {
  //TODO
});

router.post("/pound", function (req, res, next) {
  //TODO
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
