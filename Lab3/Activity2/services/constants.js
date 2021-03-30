const path = require("path");

const FILE_DIR = path.resolve();
const ANSWERS_JSON = "/resource/answers.json";
const QUESTIONS_JSON = "/resource/questions.json";
console.log(FILE_DIR);

module.exports = {
  FILE_DIR,
  ANSWERS_JSON,
  QUESTIONS_JSON,
};
