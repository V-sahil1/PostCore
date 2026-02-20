import mongoose from "mongoose";
const errorSchema = new mongoose.Schema({
  method: String,
  url: String,
  status: Number,
  responseTime: Number,
  ip: String,
  userAgent: String,
  message: String,
}
, {

});
export const mongoModel = mongoose.model("Error", errorSchema)

//change
