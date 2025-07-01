import express from "express";
import CreateProduct from "../controllers/product/CreateProduct";
import imageUploadMiddleware from "../middlewares/uploadImage";

const productRouter = express.Router();

productRouter.route("/").post(imageUploadMiddleware, CreateProduct);

export default productRouter;
