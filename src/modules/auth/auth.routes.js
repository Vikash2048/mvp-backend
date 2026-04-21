import express from "express";
// import { authRequestOTP, authVerifyOTP } from "./auth.controller.js";
import { refreshAccessToken } from "./refresh.controller.js"

const authrouter = express.Router();
// router.post("/request-otp", authRequestOTP);
// router.post("/verify-otp", authVerifyOTP);
authrouter.post("/refresh-token", refreshAccessToken);

export {authrouter} ;