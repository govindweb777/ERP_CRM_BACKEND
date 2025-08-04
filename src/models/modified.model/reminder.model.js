const mongoose = require("mongoose");
const reminderSchema = new mongoose.Schema(
{
    leadId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Lead'

    },
    title:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true

    },
    time:{
        type:String,
        required:true

    }

},{timestamps:true});
module.exports=mongoose.model("Reminder",reminderSchema);