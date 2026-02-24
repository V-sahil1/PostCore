//  import mongoose from "mongoose";
import { config } from "dotenv";
import { env } from "./env.config";
import { ERRORS } from "../const/message";
import { AppError } from "../utils/errorHandler";

config();
const connectDB = async (): Promise<void> => {
  const MONGO_URI: string = env.MONGO.MONGO_URI;
  if (!MONGO_URI) {
    throw new AppError(ERRORS.MESSAGES.NOT_FOUND("MONGO URI"), ERRORS.STATUS_CODE.NOT_FOUND);
  }

};

export default connectDB;
