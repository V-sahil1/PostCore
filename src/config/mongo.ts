//  import mongoose from "mongoose";
import { config } from "dotenv";
import { env } from "./env.config";
import { ERRORS } from "../const/error-message";
import { AppError } from "../utils/errorHandler";

config();
const connectDB = async (): Promise<void> => {
  const MONGO_URI: string = env.MONGO.MONGO_URI as string;
  if (!MONGO_URI) {
    throw new AppError(ERRORS.message.NOT_FOUND("MONGO URI"),ERRORS.statusCode.NOT_FOUND);
  }

};

export default connectDB;