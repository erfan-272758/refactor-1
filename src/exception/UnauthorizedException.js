const HttpException = require("./HttpException");

module.exports = class UnauthorizedException extends HttpException {
  constructor(message) {
    super(message, 401);
  }
};
