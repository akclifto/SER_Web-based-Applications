/* eslint-disable no-unused-vars */
const MongoClient = require("mongodb").MongoClient;

const paths = require("../services/constants");
const logger = require("../services/log");

async function connection(req, res, params) {
  MongoClient.connect(
    paths.MONGO_URL,
    {
      // still gives console warning
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    (err, db) => {
      //     if (err) {
      //       let error = logger.setErrorMessage(500, err);
      //       logger.errorLog("MongoClient", error);
      //     }
      //     // console.log("Mongo database client connected!");
      //     // console.log(params);
      //     let dbo = db.db("answers");
      //     let collection = dbo.collection("userAnswers");
      //     // console.log(collection);
      //     // console.log(req.body.startMatch);
      //     if (params.qid == 1 && req.body.startMatch !== undefined) {
      //       req.session.username = params.username;
      //     }
      //     // db.collection.findOne(query, projection)
      //     let query = { username: req.session.username };
      //     collection.findOne(query, function (err, data, callback) {
      //       if (err) {
      //         let error = logger.setErrorMessage(500, err);
      //         logger.errorLog("MongoClient", error);
      //       }
      //       if (data != null && params.username === data.username) {
      //         req.session.username = data.username;
      //         req.session.userAnswers.answer = data.answer;
      //         callback();
    }
  );
}

module.exports = {
  connection,
};
