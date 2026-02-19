import express from "express";
import registerUser from "../controllers/authentication/Register";
import isLoggedIn from "../middlewares/isLoggedIn";
import loginUser from "../controllers/authentication/Login";
import updateUser from "../controllers/user/UpdateUser";
import logout from "../controllers/authentication/Logout";
import generateAccessToken from "../controllers/authentication/GenerateAccessToken";
import getProfile from "../controllers/user/GetProfile";
import isGuest from "../middlewares/isGuest";
import guestLogin from "../controllers/authentication/GuestLogin";
import blockGuest from "../middlewares/blockGuest";

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/guest-login").post(guestLogin);
userRouter.route("/logout").post(isLoggedIn, logout);
userRouter.route("/refresh-token").post(generateAccessToken);
userRouter
  .route("/")
  .get(isLoggedIn, getProfile)
  .patch(isLoggedIn, blockGuest, updateUser);

export default userRouter;
