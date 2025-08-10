// controllers/adminController.js
const { generate: uniqueId } = require('shortid');
const Admin = require('../../models/coreModels/Admin');
const AdminPassword = require('../../models/coreModels/AdminPassword');

exports.createAdmin = async (req, res) => {
  try {
    console.log("inside admin controller")
    const { email, name, surname, password } = req.body;
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
      role: 'owner',
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
      message: 'Admin created successfully',
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
