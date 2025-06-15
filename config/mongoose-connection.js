const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${config.get("MONGODB_URI")}`);
    dbgr("MongoDB Connected Successfully");
    return conn;
  } catch (error) {
    dbgr("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

connectDB();

module.exports = mongoose.connection;
