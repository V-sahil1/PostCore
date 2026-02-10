//  import mongoose from "mongoose";
import { config } from "dotenv";
import { MESSAGES } from "../const/message";
import { env } from "./env.config";

config();
const connectDB = async (): Promise<void> => {
  const MONGO_URI: string = env.MONGO.MONGO_URI as string;
  if (!MONGO_URI) {
    throw new Error(MESSAGES.ENV_MISSING);
  }

};

export default connectDB;