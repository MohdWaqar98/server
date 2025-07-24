import {Router} from "express";
import {loginUser, registerUser, logoutUser, changePassword, changeProfile, getProfile, deleteAccount} from "../Controllers/auth.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
const userRouter = Router();
userRouter.route("/login").post(loginUser);
userRouter.route("/register").post(registerUser);
userRouter.route("/logout").post(verifyJWT,logoutUser)
userRouter.route("/profile").get(verifyJWT, getProfile);
userRouter.route("/change-password").post(verifyJWT, changePassword);
userRouter.route("/update-profile").put(verifyJWT, changeProfile);
userRouter.route("/delete-account").delete(verifyJWT, deleteAccount);
export default userRouter;