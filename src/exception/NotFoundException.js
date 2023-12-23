const HttpException = require("./HttpException");

module.exports = class NotFoundException extends HttpException {
  constructor(message) {
    super(message, 404);
  }
};
