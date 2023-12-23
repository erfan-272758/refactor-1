const HttpException = require("./HttpException");

module.exports = class TooManyRequestException extends HttpException {
  constructor(message) {
    super(message, 429);
  }
};
