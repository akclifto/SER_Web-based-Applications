const MongoClient = require("mongodb").MongoClient;

const paths = require("../services/constants");
const logger = require("../services/log");

function connection (req, res, params) {
  MongoClient.connect(
    paths.MONGO_URL,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    function (err) {
      try {
        if (err) {
          let error = logger.setErrorMessage(500, err);
          logger.errorLog("MongoClient", error);
        }
        // console.log("Mongo database client connected!");
        // console.log(params);
      } catch (err) {
        logger.errorLog("MongoClient", err);
      }
    }
    //TODO add
  );
}

module.exports = {
  connection,
};
