import mongoose from "mongoose";
const errorSchema = new mongoose.Schema({
  method: String,
  url: String,
  status: Number,
  responseTime: Number,
  ip: String,
  userAgent: String,
  message: String,
  errorStack: String,
  errorType: String,
  bodyMessage:String,
  time: {
    type: Date,
    default: Date.now
  }
}
  , {

  });
export const ErrorModel = mongoose.model("Error", errorSchema)

//change