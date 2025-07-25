const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    dbgr("MongoDB Connected Successfully");
    return conn;
  } catch (error) {
    dbgr("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

connectDB();

mongoose.set("debug", function (coll, method, query, doc, options) {
  console.log(
    `Mongoose: ${coll}.${method}(${JSON.stringify(query)}, ${JSON.stringify(
      doc
    )})`
  );
});

module.exports = mongoose.connection;
