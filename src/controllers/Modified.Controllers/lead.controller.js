const Lead = require('../../models/modified.model/lead.model');
const {uploadFileToCloudinary} = require("../..//utils/fileUpload");

// ==========================================
// @desc    Create a new lead
// @route   POST /api/leads
// ==========================================
exports.createLead = async (req, res) => {
  try {
    let { name, email, contactNo, source, Address, status, remark, notes, industry, isActive,assignedTo } =
      req.body;

    console.log('Inside createLead:', req.body);

    // ✅ Handle Address parsing
    if (typeof Address === 'string') {
      try {
        Address = JSON.parse(Address); // Safely parse nested address
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format in Address field',
        });
      }
    }

    // ✅ Access uploaded documents
    const documents = req?.files?.documents;
    console.log('Uploaded documents:', req.files);

    // ✅ Validate required fields
    if (!name || !email || !contactNo || !source || !documents ||!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'All required fields (name, email, contactNo, assignedTo ,source, documents) must be provided',
      });
    }

    // ✅ Upload document to Cloudinary
    const uploadedDoc = await uploadFileToCloudinary(documents, 'lead_documents');

    // ✅ Create new lead
    const newLead = await Lead.create({
      name,
      email,
      contactNo,
      source,
      Address, // parsed object
      status,
      remark,
      notes,
      industry,
      isActive: isActive ?? true,
      documents: uploadedDoc.secure_url,
      assignedTo,
    });

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead,
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create lead',
      error: error.message,
    });
  }
};


// ==========================================
// @desc    Get all leads
// @route   GET /api/leads
// ==========================================
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve leads',
      error: error.message,
    });
  }
};

exports.getActiveLeads = async (req, res) => {
  try {
    const leads = await Lead.find({isActive:true}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve leads',
      error: error.message,
    });
  }
};

// ==========================================
// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// ==========================================
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve lead',
      error: error.message,
    });
  }
};

// ==========================================
// @desc    Update a lead by ID
// @route   PUT /api/leads/:id
// ==========================================
// exports.updateLead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const lead = await Lead.findById(id);

//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: 'Lead not found',
//       });
//     }

//     const updateData = req.body;

//     // Optional: replace document if new file provided
//     if (req.files?.documents) {
//       const uploadedDoc = await uploadFileToCloudinary(req.files.documents, 'lead_documents');
//       updateData.documents = uploadedDoc.secure_url;
//     }

//     const updatedLead = await Lead.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     });

//     return res.status(200).json({
//       success: true,
//       message: 'Lead updated successfully',
//       data: updatedLead,
//     });
//   } catch (error) {
//     console.error('Error updating lead:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Failed to update lead',
//       error: error.message,
//     });
//   }
// };

exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    let updateData = { ...req.body };

    // ✅ Handle Address parsing - same as in createLead
    if (typeof updateData.Address === 'string') {
      try {
        updateData.Address = JSON.parse(updateData.Address);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Invalid JSON format in Address field',
        });
      }
    }

    // Optional: replace document if new file provided
    if (req.files?.documents) {
      const uploadedDoc = await uploadFileToCloudinary(req.files.documents, 'lead_documents');
      updateData.documents = uploadedDoc.secure_url;
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: error.message,
    });
  }
};

// ==========================================
// @desc    Delete a lead by ID
// @route   DELETE /api/leads/:id
// ==========================================
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: error.message,
    });
  }
};


exports.deactivateLead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deactivateLead = await Lead.findByIdAndUpdate(id,{
        isActive:false
    });

    if (!deactivateLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }


    return res.status(200).json({
      success: true,
      message: 'Lead deactivated successfully',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: error.message,
    });
  }
};


exports.activateLead = async (req, res) => {
  try {
    const { id } = req.params;

    const activateLead = await Lead.findByIdAndUpdate(id, {
      isActive: true,
    });

    if (!activateLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead activated successfully',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to activate lead',
      error: error.message,
    });
  }
};

exports.findLeadByAssignedTo =async(req,res)=>{
  try {
    let  {assignedToId}= req.params;

    if (assignedToId.startsWith(':')) {
      assignedToId = assignedToId.slice(1);
    }

    const leads = await Lead.find({assignedTo:assignedToId}).sort({createdAt:-1}).populate('assignedTo');

    const length = leads.length;
    if(length==0){
      return res.status(404).json({
        success:false,
        message:" no lead found for this assigned to user"
      })
    }
    return res.status(200).json({
      success:true,
      message:'all lead fetched successfully for this assigned user',
      leads,
      length:length
    })
    
  } catch (error) {
    console.error("problem in fetching assigned lead",error);
    return res.status(400).json({
      success:false,
      message:error.message
    })
  }
}
