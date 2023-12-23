const HttpException = require("./HttpException");

module.exports = class UnprocessableException extends HttpException {
  constructor(message) {
    super(message, 422);
  }
};
