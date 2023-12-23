const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let decodedToken;
  try {
    const authToken = req.get("Authorization");
    if (!authToken) {
      return res
        .status(401)
        .json({ message: "Validation Token is not provided" });
    }
    const token = authToken.split(" ")[1];
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token provided." });
    }

    if (!decodedToken) {
      return res.status(401).json({ message: "Not authenticated." });
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    console.error(err);
  }
};
