const { isAsyncFunction } = require("util/types");
exports.catchMiddleware = function (fn) {
  return async (req, res, next) => {
    try {
      return isAsyncFunction(fn)
        ? await fn(req, res, next)
        : fn(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
};
