const jwt = require("jsonwebtoken");
const UnauthorizedException = require("../exception/UnauthorizedException");

module.exports = (req, res, next) => {
  let decodedToken;
  try {
    const authToken = req.get("Authorization");
    if (!authToken)
      throw new UnauthorizedException("Validation Token is not provided");

    const token = authToken.split(" ")[1];
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedException("Invalid Token provided.");
    }

    if (!decodedToken) throw new UnauthorizedException("Not authenticated.");

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    console.error(err);
    throw new UnauthorizedException(err.message);
  }
};
