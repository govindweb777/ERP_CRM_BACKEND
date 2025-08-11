const mongoose = require("mongoose");
const Admin = require("../coreModels/Admin");

const leadSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true

    },
    contactNo:{
        type:Number,
        required:true
    },
    source:{
        type:String,
        required:true
    },
    Address:{
        detail:{
            type:String,


        },
        pinCode:{
            type:Number,
            required:true

        },
        city:{
            type:String,
            required:true,
        },
        country:{
            type:String,
            required:true
        }
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Admin'

    },
    status:{
        type:String,
        enum:['Not Sure','Completed','Under Conversation','Deal Closed','Under Process']

    },
    remark:{
        type:String

    },
    notes:{
        type:String,
    },
    documents:{
        type:String,
        required:true
    },
    industry:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true,

    },
    reminder: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reminder'
    }
  ]
},{timestamps:true});
module.exports = mongoose.model("Lead",leadSchema);