const debug = require("debug");
const HttpException = require("../exception/HttpException");

module.exports = function exceptionHandler(err, req, res, next) {
  debug.log(err);

  if (err instanceof HttpException)
    return res.status(err.code).json({ message: err.message });

  return res.status(500).json({ message: err.message });
};
