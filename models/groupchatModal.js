const mongoose = require("mongoose");

const GroupChatSchema = mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    group_id:{
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

module.exports = mongoose.model("GroupChat", GroupChatSchema);