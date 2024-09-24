const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/codeIDE')


let userSchema = new mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    date:{
        type:Date,
        default:Date.now
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('user',userSchema)