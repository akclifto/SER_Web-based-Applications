/* eslint-disable no-unused-vars */
let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

let session = require("./middleware/session");
let indexRouter = require("./routes/index");
let questionRouter = require("./routes/question");
let adminRouter = require("./routes/admin");

let app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// the middleware
app.use(session);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// add previous route-handling code
app.use("/", indexRouter);
app.use("/question", questionRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// set cache to no-cache
app.use(function (req, res, next) {
  console.log("set cache to no-cache");
  res.set("Cache-Control", "no-store, no-cache");
  next();
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
