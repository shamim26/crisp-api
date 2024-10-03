const express = require("express");
const registerUser = require("../controllers/authentication/Register");
const isLoggedIn = require("../middlewares/isLoggedIn");
const loginUser = require("../controllers/authentication/Login");
const updateUser = require("../controllers/user/UpdateUser");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.patch("/:id", updateUser);

module.exports = userRouter;
