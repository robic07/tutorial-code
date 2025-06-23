import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/tutorial-database";
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(connectionURI, {
      useNewUrlParser: true,
    });
    console.log(`MongoDb Connected": ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
