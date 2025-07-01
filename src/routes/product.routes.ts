import express from "express";
import CreateProduct from "../controllers/product/CreateProduct";
import imageUploadMiddleware from "../middlewares/uploadImage";
import GetAllProducts from "../controllers/product/GetAllProducts";
import GetProduct from "../controllers/product/GetProduct";
import UpdateProduct from "../controllers/product/UpdateProduct";
import DeleteProduct from "../controllers/product/DeleteProduct";
import isLoggedIn from "../middlewares/isLoggedIn";
import isAdmin from "../middlewares/isAdmin";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(isLoggedIn, isAdmin, imageUploadMiddleware, CreateProduct)
  .get(GetAllProducts);

productRouter
  .route("/:id")
  .get(GetProduct)
  .put(isLoggedIn, isAdmin, UpdateProduct)
  .delete(isLoggedIn, isAdmin, DeleteProduct);

export default productRouter;
