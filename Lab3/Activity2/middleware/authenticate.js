// let fakeDB = require("../db/fakedb");

const logger = require("../services/log");
// fakeDB = new fakeDB();

/**
 * Method to authenticate admin login via fake database query.
 * @param {*} username : username to check
 * @param {*} password : password to check
 * @returns Promise of true if user is authenticated, false otherwise.
 */
function authenticate(username, password) {
  //   console.log(fakeDB.db);
  return new Promise(function (resolve, reject) {
    // try {
    //   fakeDB.db.forEach(function (item) {
    //     // console.log(username + " " + password);
    //     // console.log(item.username + " " + item.password);
    //     if (username === item.username && password === item.password) {
    //       logger.serverLog(`User/password match found for ${username}`);
    //       resolve(true);
    //     }
    //   });
    // } catch (err) {
    //   logger.errorLog("authenticate", err);
    // }
    if (username === password) {
      resolve(true);
    } else {
      logger.serverLog(`No User/password found for ${username}`);
      reject(false);
    }
  });
}

module.exports = authenticate;
