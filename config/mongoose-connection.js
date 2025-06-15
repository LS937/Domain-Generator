const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
