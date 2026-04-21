import { createLogger } from "../../utils/logger.js";

const otpStore = new Map();
const logger = createLogger({ module: "otp-store" });

export const saveOTP = (phone, otp) => {
    otpStore.set(phone, 
        {
            otp,
            expiresAt: Date.now() + 2 * 60 * 1000
        }
    );
};

export const verifyOTP = (phone, otp) => {
    logger.info({ phone, hasRecord: otpStore.has(phone) }, "Verifying OTP from in-memory store");
    const record = otpStore.get(phone);
    if (!record) return false;
    if (Date.now() > record.expiresAt) return false;
    return record.otp === otp; 
};

export const deleteOTP = (phone) => {
    otpStore.delete(phone);
};
