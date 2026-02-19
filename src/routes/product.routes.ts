import express from "express";
import CreateProduct from "../controllers/product/CreateProduct";
import imageUploadMiddleware from "../middlewares/uploadImage";
import GetAllProducts from "../controllers/product/GetAllProducts";
import GetProduct from "../controllers/product/GetProduct";
import UpdateProduct from "../controllers/product/UpdateProduct";
import DeleteProduct from "../controllers/product/DeleteProduct";
import GetProductStats from "../controllers/product/GetProductStats";
import ImportProducts from "../controllers/product/ImportProducts";
import isLoggedIn from "../middlewares/isLoggedIn";
import isAdmin from "../middlewares/isAdmin";
import uploadCsv from "../middlewares/uploadCsv";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(isLoggedIn, isAdmin, imageUploadMiddleware, CreateProduct)
  .get(GetAllProducts);

productRouter.post(
  "/import",
  isLoggedIn,
  isAdmin,
  uploadCsv.single("file"),
  ImportProducts
);

productRouter.get("/stats", GetProductStats);

productRouter
  .route("/:id")
  .get(GetProduct)
  .put(isLoggedIn, isAdmin, imageUploadMiddleware, UpdateProduct)
  .delete(isLoggedIn, isAdmin, DeleteProduct);

export default productRouter;
