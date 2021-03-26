/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
// function job() {
//   return new Promise(function (resolve, reject) {
//     resolve();
//   });
// }

// let promise = job();

// promise
//   .then(function () {
//     console.log("suc 1");
//   })
//   .catch(function () {
//     console.log("err 1");
//   })
//   .finally(function () {
//     console.log("succ 2");
//   });

import express from "express";
const app = express();

app.get("/HelloWorld", function (req, res, next) {
  console.log("hello1");
  next();
});

app.use(function (req, res, next) {
  console.log("hello2");
  next();
});

app.use(function (req, res) {
  console.log("hello3");
  res.send("Hello3");
});

app.listen(3000);

// import fs from "fs";

// console.log("A");

// fs.readFile("package.json", function (err, data) {
//   if (err) {
//     console.log("D");
//   }
//   console.log("B");
// });
// console.log("C");
