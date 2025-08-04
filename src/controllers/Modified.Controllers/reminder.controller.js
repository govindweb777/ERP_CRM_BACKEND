const Reminder = require('../../models/modified.model/reminder.model');
const Lead = require('../../models/modified.model/lead.model');
const mongoose= require("mongoose");

exports.addReminder=async(req,res)=>{
    try {
        
        const {
            leadId,
            title,
            date,
            time
        }= req.body;
        console.log(req.body);

        if (!mongoose.Types.ObjectId.isValid(leadId)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid leadId format',
          });
        }

        const lead= await Lead.findById(leadId);
        // const leads = await Lead.find();
        // console.log("leads are :",leads);
        if(!lead){
            return res.status(404).json({
                success:false,
                message:"lead not found"
            })
        }
        const newReminder = await Reminder.create({
            leadId,
            title,
            date,
            time
        })
        const populatedReminder = await newReminder.populate('leadId');
        
        

        return res.status(200).json({
            sucess:true,
            message:"reminder added successfully",
            reminder:populatedReminder
            

        })

        
    } catch (error) {
        console.error("error in adding reminder",error);
        return res.status(400).json({
            success:false,
            message:error.message
        })
        
    }

}

exports.getAllReminder = async(req,res)=>{
    try {
        const reminders =await Reminder.find().populate('leadId');
        if(reminders.length==0){
            return res.status(404).json({
                success:false,
                message:"no reminder found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"all reminder fetched successfully",
            legth:reminders.length,
            reminders,


        })
        
    } catch (error) {
        console.error("error in fetching reminder",error);
        return res.status(400).json({
            success:false,
            message:error.message
        })
        
    }
}

exports.getReminderByDate = async(req,res)=>{
    try {
        const {date}= req.params;
        const reminders = await Reminder.find({
            date:date
        }).populate('leadId')
        ;
        if(reminders.length==0){
            return res.status(404).json({
                success:false,
                message:"no reminder has been found on this  specific date"
            })
        }
        return res.status(200).json({
            success:true,
            message:`all reminders of ${date} has been fetched successfully`,
            length:reminders.length,
            data:reminders,

        })
        
    } catch (error) {
        console.error("failed to get remminder by date",error);
        return res.status(400).json({
            succcess:false,
            message:error.message
        })
        
    }
}

exports.getReminderByLeadId = async(req,res)=>{
    try {
        const {
            LeadId
        }= req.params;
        
        const reminders = await Reminder.find({ LeadId })
        
        if(reminders.length==0){
            return res.status(404).json({
                success:false,
                message:"reminder not found for this lead"
            })
        }
        return res.status(200).json({
            success:true,
            length: reminders.length,
            reminders
        })

        
    } catch (error) {
        console.error("error in geting reminder by lead id",error);
        return res.status(400).json({
            success:false,
            message:error.message
        })
        
    }
}

exports.deleteReminder = async(req,res)=>{
    try {
        const {reminderId} = req.params;
        
        if(!reminderId){
            return res.status(402).json({
                succcess:false,
                message:"mising required fields"
            })
        }
        const reminder = await Reminder.findByIdAndDelete(reminderId);
        
        if(!reminder){
            return res.status(400).json({
                success:false,
                message:"reminder not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"reminder has been deleted successfully"
        })
        
    } catch (error) {
        console.error("error in deleting reminder",error);
        return res.status(400).json({
            success:false,
            message:error.message
        })
        
    }
}