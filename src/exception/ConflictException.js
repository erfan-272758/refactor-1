const HttpException = require("./HttpException");

module.exports = class ConflictException extends HttpException {
  constructor(message) {
    super(message, 409);
  }
};
