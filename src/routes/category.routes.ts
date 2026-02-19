import express from "express";
import GetCategory from "../controllers/category/GetCategory";
import CreateCategory from "../controllers/category/CreateCategory";
import isLoggedIn from "../middlewares/isLoggedIn";
import isAdmin from "../middlewares/isAdmin";
import DeleteCategory from "../controllers/category/DeleteCategory";
import UpdateCategory from "../controllers/category/UpdateCategory";
import GetAllCategories from "../controllers/category/GetAllCategories";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(GetAllCategories)
  .post(isLoggedIn, isAdmin, CreateCategory);

categoryRouter
  .route("/:id")
  .get(GetCategory)
  .patch(isLoggedIn, isAdmin, UpdateCategory)
  .delete(isLoggedIn, isAdmin, DeleteCategory);

export default categoryRouter;
