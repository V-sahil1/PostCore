import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
     username:{
        type:String,
        
    },
    error:{
        type:String,
        

    }
},{
    
});
module.exports = mongoose.model("Error",userSchema)