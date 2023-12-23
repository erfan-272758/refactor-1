const BadRequestException = require("../exception/BadRequestException");
const ConflictException = require("../exception/ConflictException");
const HttpException = require("../exception/HttpException");
const NotFoundException = require("../exception/NotFoundException");
const UnauthorizedException = require("../exception/UnauthorizedException");
const UnprocessableException = require("../exception/UnprocessableException");
const { catchMiddleware } = require("../middleware/utils");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signUp = catchMiddleware(async (req, res) => {
  const fullname = req.body.fullname;
  const secretString = req.body.secretString;

  if (fullname == null || secretString == null)
    throw new NotFoundException("Please provide all requested data.");

  // just to handle secret string not having dots or dashes
  if (secretString.includes(".") && secretString.includes("-"))
    throw new UnprocessableException(
      "Provided data is not valid! Secret String should not contain - and . in the same time."
    );

  // can not create if exists before
  const exists = await User.findOne({ secretString: secretString });
  if (exists)
    throw new ConflictException(
      "User can not be created bacause a document with this secret string already exists."
    );

  const user = await User.create({
    fullname: fullname,
    secretString: secretString,
    otp: Math.floor(Math.random() * 90000) + 10000,
  });
  return res.status(201).json({ message: "User created successfully.", user });
});

exports.login = catchMiddleware(async (req, res) => {
  const secretString = req.body.secretString;
  const otp = req.body.otp;

  const user = await User.findOne({ secretString: secretString });

  if (!user) throw new NotFoundException("Please provide valid credentials.");

  if (user.otp !== otp)
    throw new NotFoundException("Please provide valid credentials.");

  const fullname = user.fullname;
  const token = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return res
    .status(200)
    .json({ message: `Dear ${fullname} you are logged in`, token });
});

exports.getName = catchMiddleware(async (req, res) => {
  const secretString = req.body.secretString;

  // just to handle secret string not having dots or dashes
  if (secretString.includes(".") && secretString.includes("-")) {
    throw new UnprocessableException(
      "Provided data is not valid! Secret String should not contain - and . in the same time."
    );
  }

  try {
    const user = await User.findOne({ secretString: secretString });

    const userId = user.id;

    if (userId.toString() !== req.userId)
      throw new UnauthorizedException("Credentials not valid.");

    if (!user) throw new UnauthorizedException("User not found.");

    const fullname = user.fullname;
    return res
      .status(200)
      .send(`You are authenticated and your name is ${fullname}`);
  } catch (err) {
    console.error(err);
    if (err instanceof HttpException) throw err;
    throw new BadRequestException("Invalid input.");
  }
});
