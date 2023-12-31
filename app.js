//* external modules import
const express = require("express");
const path = require("path");
const debug = require("debug")("task_1");
const dotEnv = require("dotenv").config({ path: "./src/config/.env.local" });

//* internal modules import
const connectDB = require("./src/config/db");
const authRouter = require("./src/routes/auth");
const exceptionHandler = require("./src/middleware/exceptionHandler");

const app = express();

//* Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS , POST");
  res.setHeader("Access-Control-Allow-Headers", "Authorization");
  next();
});

//* Database connection
connectDB();
debug("Connected To Database");

//* Routes
app.use("/auth", authRouter);

//* Exception Handler
app.use(exceptionHandler);

//* server start
const PORT = process.env.PORT;
module.exports = app.listen(PORT, () =>
  debug(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
