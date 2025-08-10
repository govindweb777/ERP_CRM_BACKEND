// const mongoose = require('mongoose');

// const updateProfile = async (userModel, req, res) => {
//   Console.log("uodate profile hitted");
//   const User = mongoose.model(userModel);

//   const reqUserName = userModel.toLowerCase();
//   const userProfile = req[reqUserName];
//   console.log("inside User Profile")

//   if (userProfile.email === 'admin@demo.com') {
//     return res.status(403).json({
//       success: false,
//       result: null,
//       message: "you couldn't update demo informations",
//     });
//   }

//   let updates = req.body.photo
//     ? {
//         email: req.body.email,
//         name: req.body.name,
//         surname: req.body.surname,
//         photo: req.body.photo,
//       }
//     : {
//         email: req.body.email,
//         name: req.body.name,
//         surname: req.body.surname,
//       };
//       console.log("inside update controller",updates)
//   // Find document by id and updates with the required fields
//   const result = await User.findOneAndUpdate(
//     { _id: userProfile._id, removed: false },
//     { $set: updates },
//     {
//       new: true, // return the new result instead of the old one
//     }
//   ).exec();

//   if (!result) {
//     return res.status(404).json({
//       success: false,
//       result: null,
//       message: 'No profile found by this id: ' + userProfile._id,
//     });
//   }
//   return res.status(200).json({
//     success: true,
//     result: {
//       _id: result?._id,
//       enabled: result?.enabled,
//       email: result?.email,
//       name: result?.name,
//       surname: result?.surname,
//       photo: result?.photo,
//       role: result?.role,
//     },
//     message: 'we update this profile by this id: ' + userProfile._id,
//   });
// };

// module.exports = updateProfile;
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');

const updateProfile = async (userModel, req, res) => {
  try {
    console.log('update profile hit');

    const User = mongoose.model(userModel);
    const reqUserName = userModel.toLowerCase();
    const userProfile = req[reqUserName];

    if (!userProfile) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized or invalid user profile',
      });
    }

    console.log('Inside update profile for user:', userProfile.email);

    // Prevent changing the demo admin
    if (userProfile.email === 'admin@demo.com') {
      return res.status(403).json({
        success: false,
        message: "You couldn't update demo informations",
      });
    }

    // Start building updates from body
    let updates = {
      email: req.body.email || userProfile.email,
      name: req.body.name || userProfile.name,
      surname: req.body.surname || userProfile.surname,
    };

    // If a file is uploaded
    if (req.files && req.files.photo) {
      console.log('Photo detected, uploading...');
      const photoFile = req.files.photo;

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(photoFile.tempFilePath, {
        folder: 'profile_photos',
      });

      updates.photo = uploadResult.secure_url;
    }
    // If no file in multipart but JSON includes a photo URL
    else if (req.body.photo) {
      updates.photo = req.body.photo;
    }

    console.log('Final update object:', updates);

    const result = await User.findOneAndUpdate(
      { _id: userProfile._id, removed: false },
      { $set: updates },
      { new: true }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No profile found by this id: ' + userProfile._id,
      });
    }

    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        surname: result.surname,
        photo: result.photo,
        role: result.role,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

module.exports = updateProfile;

