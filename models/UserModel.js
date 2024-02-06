const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    image:{
        type:String,
        required: true
    },
    is_online:{
        type:String,
        default: "0"
    },
    password:{
        type:String,
        required: true
    },
    last_seen: {
        type: Date,
        default: Date.now,
    },
},
{
    timestamps: true
});


module.exports = mongoose.model("Users", UserSchema);