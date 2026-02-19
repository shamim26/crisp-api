import { Request, Response } from "express";
import Product from "../../models/product.model";
import asyncHandler from "../../utils/asyncHandler";
import { errorResponse, successResponse } from "../responseController";
import { generateSlug } from "../../helper/generateSlug";

const UpdateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // 1. Extract new images from middleware
  const newUploadedImages = (req as any).uploadedImages || [];
  const newFeaturedImage = (req as any).uploadedFeaturedImage || null;

  // 2. Extract body fields
  let {
    name,
    description,
    category,
    brand,
    pricing,
    variants,
    specifications,
    seo,
    isFeatured,
    images: existingImagesBody, // Expecting existing images as array of strings
  } = req.body;

  // Helper for parsing JSON from FormData
  const parseJSON = (field: any) => {
    if (typeof field === "string") {
      try {
        return JSON.parse(field);
      } catch (e) {
        return field;
      }
    }
    return field;
  };

  pricing = parseJSON(pricing);
  variants = parseJSON(variants);
  specifications = parseJSON(specifications);
  seo = parseJSON(seo);

  // Existing images might come as string (if 1) or array of strings.
  // If it comes as "[]" string (empty array), or valid JSON array string.
  // Or if using array convention in FormData images[] -> express might give array.
  // We need to be careful.
  let existingImages: string[] = [];
  if (existingImagesBody) {
    if (Array.isArray(existingImagesBody)) {
      existingImages = existingImagesBody as string[];
    } else if (typeof existingImagesBody === "string") {
      try {
        const parsed = JSON.parse(existingImagesBody);
        if (Array.isArray(parsed)) existingImages = parsed;
        else existingImages = [existingImagesBody]; // literal url string
      } catch {
        existingImages = [existingImagesBody];
      }
    }
  }

  // combine images
  const finalImages = [...existingImages, ...newUploadedImages];

  const updateData: any = {
    description,
    category,
    brand,
    pricing,
    variants,
    specifications,
    seo,
    images: finalImages,
  };

  if (name) {
    updateData.name = name;
    updateData.slug = generateSlug(name);
  }

  if (isFeatured !== undefined) {
    updateData.isFeatured = isFeatured === "true" || isFeatured === true;
  }

  if (newFeaturedImage) {
    updateData.featuredImage = newFeaturedImage;
  }

  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!product) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Product not found",
    });
  }

  return successResponse(res, {
    statusCode: 200,
    message: "Product updated successfully",
    payload: product,
  });
});

export default UpdateProduct;
