const mongoose = require("mongoose");

//Define schema
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        lowercase:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    }
    });