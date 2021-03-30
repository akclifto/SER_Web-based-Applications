let session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const paths = require("../services/constants");
// https://meghagarwal.medium.com/storing-sessions-with-connect-mongo-in-mongodb-64d74e3bbd9c

module.exports = session({
  secret: "admin secret",
  resave: false,
  saveUninitialized: false,
  name: "sessionId",
  store: new MongoStore({
    url: paths.MONGO_URL.concat("/answers"),
  }),
});
