import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Product from "../../models/product.model";
import { successResponse } from "../responseController";
import generateSlug from "../../utils/generateSlug";

const CreateProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    colors,
    brand,
    specifications,
    keyFeatures,
    offerPrice,
    warranty,
  } = req.body;

  const images = (req as any).uploadedImages;
  const featuredImage = (req as any).uploadedFeaturedImage;

  const slug = generateSlug(name);

  const productData = {
    name,
    slug,
    description,
    price,
    category,
    stock,
    images,
    featuredImage,
    colors,
    brand,
    specifications,
    keyFeatures,
    offerPrice,
    warranty,
  };

  const newProduct = await Product.create(productData);

  return successResponse(res, {
    statusCode: 201,
    message: "Product created successfully",
    product: newProduct,
  });
});

export default CreateProduct;
