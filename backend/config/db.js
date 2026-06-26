import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`[DB] Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) =>
      console.error(`[DB] Error: ${err.message}`),
    );
  } catch (err) {
    console.error(`[DB] Connection failed: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
