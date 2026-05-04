import express from "express";
import { verifyOTP, refreshedAccessToken, logout, logoutAllDevice } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/refresh-token", refreshedAccessToken);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/logout-all", authMiddleware, logoutAllDevice);

export default authRouter;