const HttpException = require("./HttpException");

module.exports = class BadRequestException extends HttpException {
  constructor(message) {
    super(message, 401);
  }
};
