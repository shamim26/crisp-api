import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadToCloudinary = async (file: string) => {
  const result = await cloudinary.uploader
    .upload(file, {
      resource_type: "image",
    })
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
  return result;
};

export default uploadToCloudinary;
