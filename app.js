//* external modules import
const express = require('express');
const path = require('path');
const debug = require('debug')("task_1");
const dotEnv = require("dotenv").config({ path: './config/config.env' });

//* internal modules import


const app = express();


//* Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods', 'OPTIONS , POST'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    next();
})


//* Database connection
const connectDB = require('./configs/db');
connectDB();
debug("Connected To Database");


//* Routes
app.use('/auth', require('./routes/auth'));


//* server start
const PORT = process.env.PORT;
module.exports = app.listen(PORT, () => debug(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));