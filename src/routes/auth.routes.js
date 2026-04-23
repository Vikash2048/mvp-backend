import express from "express";
import { verifyOTP, refreshedAccessToken } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/verify-otp", verifyOTP);
authRouter.get("/refresh-token", refreshedAccessToken);

export default authRouter;