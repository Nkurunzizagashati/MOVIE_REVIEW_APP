import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)
    );
    console.log("CONNECTED TO MONGODB SUCCESSFULLY😊");
  } catch (err) {
    console.log(err.message);
  }
};

export default connectDB;
