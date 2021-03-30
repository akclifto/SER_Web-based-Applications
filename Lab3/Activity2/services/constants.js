const path = require("path");
/**
 * Class to hold commonly used file paths and/or constants
 */
const FILE_DIR = path.resolve();
const ANSWERS_JSON = "/resource/answers.json";
const QUESTIONS_JSON = "/resource/questions.json";
const MONGO_URL = "mongodb://localhost:27017";

module.exports = {
  FILE_DIR,
  ANSWERS_JSON,
  QUESTIONS_JSON,
  MONGO_URL,
};
