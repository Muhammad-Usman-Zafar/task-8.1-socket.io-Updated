const mongoose = require("mongoose");

const MemberSchema = mongoose.Schema({
    group_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Member", MemberSchema);