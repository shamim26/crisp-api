import { v2 as cloudinary } from "cloudinary";

const deleteFromCloudinary = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};

const extractPublicId = (url: string) => {
  // Returns: folder/sample
  const parts = url.split("/upload/");
  if (parts.length < 2) return "";
  const path = parts[1].split(".")[0]; // remove file extension
  // Remove version if present (e.g., v1234567890/)
  return path.replace(/^v\d+\//, "");
};

export { deleteFromCloudinary, extractPublicId };
