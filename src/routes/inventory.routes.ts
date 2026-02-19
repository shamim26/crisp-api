import express from "express";

const inventoryRouter = express.Router();

inventoryRouter.route("/").get();

export default inventoryRouter;
