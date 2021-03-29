let session = require("express-session");

module.exports = session({
  secret: "admin",
  resave: false,
  saveUninitialized: false,
  name: "sessionId",
  // TODO EC DB store
});
