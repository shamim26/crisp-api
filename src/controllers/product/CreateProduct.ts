import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Product from "../../models/product.model";
import { successResponse } from "../responseController";
import { generateSlug } from "../../helper/generateSlug";

const CreateProduct = asyncHandler(async (req: Request, res: Response) => {
  // 1. Extract images from middleware
  const uploadedImages = (req as any).uploadedImages || [];
  const uploadedFeaturedImage = (req as any).uploadedFeaturedImage || "";

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
  } = req.body;

  // JSON parsing helper
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

  // 3. Construct product data matching Model
  const productData = {
    name,
    slug: generateSlug(name),
    description,
    category,
    brand,
    pricing,
    variants,
    specifications,
    images: uploadedImages,
    featuredImage: uploadedFeaturedImage,
    seo,
    isFeatured: isFeatured === "true" || isFeatured === true,
  };

  const newProduct = await Product.create(productData);

  return successResponse(res, {
    statusCode: 201,
    message: "Product created successfully",
    payload: newProduct,
  });
});

export default CreateProduct;
