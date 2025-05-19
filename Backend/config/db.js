import mongoose from "mongoose";
import env from "./config.env.js";

const url = env.MONGO_URI;

const connectDB = async () => {
  try {
    const connected = await mongoose.connect(url);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
