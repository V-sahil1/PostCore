import mongoose from "mongoose";
import { config } from "dotenv";
config();


 const connectDB = async (): Promise<void> => {
    const MONGO_URI:string = process.env.MONGO_URI as string;
    if(!MONGO_URI){
        throw new Error("MONGO_URI is not defined in environment variables");
    }
  try {
    const connect = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);

  }
};

export default connectDB;
