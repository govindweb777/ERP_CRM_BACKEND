const cloudinary = require('cloudinary').v2;

/**
 * Uploads a file (image or PDF) to Cloudinary
 * @param {object} file - The file object (from req.files)
 * @param {string} folder - Cloudinary folder name
 * @param {number} [height] - Optional image height
 * @param {number} [quality] - Optional image quality
 */
exports.uploadFileToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = {
      folder,
      resource_type: 'auto', // this ensures PDF, image, video, etc. are auto-detected
    };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};
