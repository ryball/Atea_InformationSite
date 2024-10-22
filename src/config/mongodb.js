// mongodb.js - MongoDB connection configuration
const { MongoClient } = require("mongodb");

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}
const mongoClient = new MongoClient(mongoUri);

const connectMongoDB = async () => {
  try {
    await mongoClient.connect();
    console.log(
      "Connected to MongoDB (Database: " + process.env.MONGODB_NAME + ")"
    );
    return mongoClient.db(process.env.MONGODB_NAME);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectMongoDB;
