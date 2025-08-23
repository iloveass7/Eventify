import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
config();

const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
    console.log("Cloudinary connected successfully.");
  } catch (error) {
    console.error("Failed to connect to Cloudinary:", error);
  }
};

export default connectCloudinary;
