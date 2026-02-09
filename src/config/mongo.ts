//  import mongoose from "mongoose";
import { config } from "dotenv";
import { MESSAGES } from "../const/message";

config();
const connectDB = async (): Promise<void> => {
  const MONGO_URI: string = process.env.MONGO_URI as string;
  if (!MONGO_URI) {
    throw new Error(MESSAGES.ENV_MISSING);
  }

};

export default connectDB;