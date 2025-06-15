const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${config.get("MONGODB_URI")}`, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    dbgr("MongoDB Connected Successfully");
    return conn;
  } catch (error) {
    dbgr("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

connectDB();

module.exports = mongoose.connection;
