import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  method: String,
  url: String,
  status: Number,
  responseTime: Number,
  ip: String,
  userAgent: String,
  message: String,
  time: {
    type: Date,
    default: Date.now
  }
}
  , {

  });
export default mongoose.model("Error", userSchema)

//change