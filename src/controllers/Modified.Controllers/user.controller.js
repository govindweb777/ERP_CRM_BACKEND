// controllers/adminController.js
const { generate: uniqueId } = require('shortid');
const Admin = require('../../models/coreModels/Admin');
const AdminPassword = require('../../models/coreModels/AdminPassword');

exports.createAdmin = async (req, res) => {
  try {
    console.log("inside admin controller")
    const { email, name, surname, password ,role} = req.body;
    console.log("req.body is:",req.body);

    // check if email already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists',
      });
    }

    // create admin
    const newAdmin = new Admin({
      email: email.toLowerCase().trim(),
      name,
      surname,
      enabled: true,
      role,
    });
    const savedAdmin = await newAdmin.save();

    // create password entry
    const salt = uniqueId();
    const adminPassword = new AdminPassword();
    const passwordHash = adminPassword.generateHash(salt, password);

    await new AdminPassword({
      password: passwordHash,
      emailVerified: true,
      salt,
      user: savedAdmin._id,
    }).save();

    res.status(201).json({
      success: true,
      message: `${role} created successfully`,
      adminId: savedAdmin._id,
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getAllAdmin = async(req,res)=>{
  try {
    const admins = await Admin.find().sort({createdAt:-1});
    const length= admins.length;
    if(length==0){
      return res.status(404).json({
        success:false,
        message:"no admins found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"all users has been found successfully",
      admins,
      length:length

    })
    
  } catch (error) {
    console.log("error while fetching all admins",error);
    return res.status(400).json({
      success:false,
      message:error.message
    })
    
  }
}

exports.disableAdmin = async(req,res)=>{
  try {
    const {adminId} = req.params;
    
    
    const admin = await Admin.findByIdAndUpdate(adminId,{
      enabled:false
    },
    {
      new:true
    }
  );
    if(!admin){
      return res.status(404).json({
        success:false,
        message:"admin not found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"admin has been disable successfully"
    })
    
    
  } catch (error) {
    console.log("error in disabling the admin",error);
    return res.status(200).json({
      success:false,
      message:error.message
    })
    
  }
}

exports.enableAdmin = async(req,res)=>{
  try {
    const { adminId } = req.params;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      {
        enabled:true,
      },
      {
        new: true,
      }
    );
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'admin not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'admin has been enable successfully',
    });
  } catch (error) {
    console.log('error in enabling the admin', error);
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
}