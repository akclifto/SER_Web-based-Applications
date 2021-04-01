let fakeDB = require("../db/fakedb");

const logger = require("../services/log");
fakeDB = new fakeDB();

function authenticate(username, password) {
  //   console.log(fakeDB.db);
  return new Promise(function (resolve, reject) {
    try {
      fakeDB.db.forEach(function (item) {
        // console.log(username + " " + password);
        // console.log(item.username + " " + item.password);
        if (username === item.username && password === item.password) {
          logger.serverLog(`User/password match found for ${username}`);
          resolve(true);
        }
      });
    } catch (err) {
      logger.errorLog("authenticate", err);
    }
    logger.serverLog(`No User/password found for ${username}`);
    reject(false);
  });
}

module.exports = authenticate;
