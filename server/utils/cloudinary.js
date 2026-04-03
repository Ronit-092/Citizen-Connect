import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure cloudinary (environment variables should be loaded before this module is imported)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to cloudinary
export const uploadToCloudinary = async (filePath) => {
  try {
    console.log('Uploading to Cloudinary:', filePath);
    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '****' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '****' : 'NOT SET'
    });
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'citizenconnect/complaints',
      resource_type: 'auto'
    });

    console.log('Upload successful:', result.secure_url);

    // Delete local file after upload
    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Delete local file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Delete image from cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from cloudinary:', error);
    throw error;
  }
};

export default cloudinary;