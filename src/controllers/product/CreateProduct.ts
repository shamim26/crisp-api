import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Product from "../../models/product.model";
import { successResponse } from "../responseController";

const CreateProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    images,
    featuredImage,
    size,
    colors,
    quantity,
  } = req.body;

  const productData = {
    name,
    description,
    price,
    category,
    stock,
    images,
    featuredImage,
    size,
    colors,
    quantity,
  };

  const newProduct = await Product.create(productData);

  return successResponse(res, {
    statusCode: 201,
    message: "Product created successfully",
    product: newProduct,
  });
});

export default CreateProduct;
