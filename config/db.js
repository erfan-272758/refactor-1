const mongoose = require('mongoose');
const debug = require('debug')("task_1");

const connectDB = async () => {
    try {
        const conn = await mongoose
            .connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
            });
        debug(`MongoDB Connected : ${conn.connection.host}:${conn.connection.port}`);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDB;