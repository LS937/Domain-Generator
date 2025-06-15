const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${config.get("MONGODB_URI")}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    dbgr("MongoDB Connected Successfully");
    return conn;
  } catch (error) {
    dbgr("Error connecting to MongoDB:", error);
    process.exit(1); // Exit with failure
  }
};

connectDB();

module.exports = mongoose.connection;
