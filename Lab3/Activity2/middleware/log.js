/**
 * A
 */

/**
 * Method to handle error messaging payload for error pug
 * @param {*} statusCode : status code of error
 * @param {*} errorMessage : message of error
 * @returns : object containing error
 */
function setErrorMessage(statusCode, errorMessage) {
  let error = {
    status: statusCode,
    message: errorMessage,
  };
  return error;
}

/**
 * Method to normalize error logs from server.
 * @param {*} location : location of the error
 * @param {*} err : error message and stacktrace to log
 */
function errorLog(location, err) {
  console.log("ErrorLog: ", location, ": ", err);
}

/**
 * Method to normalize server logs.
 * @param {*} message : message to log
 */
function serverLog(message) {
  console.log("Server: ", message);
}

module.exports = {
  setErrorMessage,
  errorLog,
  serverLog,
};
