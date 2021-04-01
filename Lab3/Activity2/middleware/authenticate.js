let fakeDB = require("../db/fakedb");

const logger = require("../services/log");
fakeDB = new fakeDB();

function authenticate(username, password) {
  console.log(username + " " + password);
    console.log(fakeDB.db);
  return new Promise(function (resolve, reject) {
    fakeDB.db.forEach(function (item) {
      if (
        username === fakeDB.db[item].username &&
        password === fakeDB.db[item].password
      ) {
        logger.serverLog(`User/password match found for ${username}`);
        resolve(true);
      }
    });
    logger.serverLog(`No User/password found for ${username}`);
    reject(false);
  });
}

module.exports = authenticate;
