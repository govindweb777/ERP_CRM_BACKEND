const cloudinary = require('cloudinary').v2; //! Cloudinary is being required
require ('dotenv').config();
console.log("process.env.CLOUD_NAME,",process.env.CLOUD_NAME,); 
      console.log("api_key", process.env.API_KEY);

      console.log("api_secret",process.env.API_SECRET);

exports.cloudinaryConnect = () => {
  try {
    cloudinary.config({
      
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  } catch (error) {
    console.log(error);
  }
};
