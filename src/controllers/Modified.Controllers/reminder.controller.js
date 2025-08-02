const Reminder = require('../../models/modified.model/reminder.model');
const lead = require('../../models/modified.model/reminder.model');

exports.addReminder=async(req,res)=>{
    try {
        
        const {
            leadId,
            title,
            date,
            time
        }= req.body;

        const lead= await lead.findById(leadId);
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
        const {date}= req.query;
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

exports.deleteReminder = async(req,res)=>{
    try {
        const reminderId = req.params;
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