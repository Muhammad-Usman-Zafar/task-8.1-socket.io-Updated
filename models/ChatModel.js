const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    reciever_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    message:{
        type:String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Chat", ChatSchema);