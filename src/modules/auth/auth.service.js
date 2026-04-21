import User from "../../models/user.model.js";
import { saveOTP, verifyOTP, deleteOTP } from "./otp.store.js";
import {generateTokens} from "./token.service.js";
import { createLogger } from "../../utils/logger.js";

const logger = createLogger({ module: "auth-service" });


const requestOTP = async (phone) => {
    const otp = "123456"; // mocked otp
    saveOTP(phone, otp);
    return otp;
};

const verifyOTPAndLogin = async (phone, otp) => {
    if (!verifyOTP(phone, otp)){
        throw new Error("[auth service] Invalid or expired OTP");
    }

    deleteOTP(phone);

    let user = await User.findOne({ phone });
    if(!user) {
        user = await User.create({ phone });
        logger.info({ userId: user._id, phone }, "User created during OTP login");
    }
    else{
        logger.info({ userId: user._id, phone }, "Existing user found during OTP login");
    }

    user.lastLogin = new Date();
    await user.save();

    const tokens = await generateTokens(user._id);
    return { user, tokens };
};

