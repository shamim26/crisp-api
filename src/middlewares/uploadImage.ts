import { Request, Response, NextFunction } from "express";
import multer from "multer";
import uploadToCloudinary from "../helper/uploadToCloudinary";
import fs from "fs";

// Set up multer storage (in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // optional: 3MB limit per file
});

const imageUploadMiddleware = [
  upload.fields([
    { name: "images", maxCount: 5 }, // up to 5 images
    { name: "featuredImage", maxCount: 1 }, // only 1 featured image
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Handle multiple images
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const images = files?.["images"] || [];
      const featuredImage = files?.["featuredImage"]?.[0] || null;

      // Upload images to Cloudinary
      const imageUrls = [];
      for (const file of images) {
        const tempPath = `public/temp/${Date.now()}-${file.originalname}`;
        fs.writeFileSync(tempPath, file.buffer);
        const result = await uploadToCloudinary(tempPath);
        fs.unlinkSync(tempPath);
        imageUrls.push(result.url); // or result.secure_url
      }

      // Upload featured image to Cloudinary
      let featuredImageUrl = null;
      if (featuredImage) {
        const tempPath = `public/temp/${Date.now()}-${featuredImage.originalname}`;
        fs.writeFileSync(tempPath, featuredImage.buffer);
        const result = await uploadToCloudinary(tempPath);
        fs.unlinkSync(tempPath);
        featuredImageUrl = result.url; // or result.secure_url
      }

      // Attach to request
      (req as any).uploadedImages = imageUrls;
      (req as any).uploadedFeaturedImage = featuredImageUrl;

      next();
    } catch (error) {
      next(error);
    }
  },
];

export default imageUploadMiddleware;
