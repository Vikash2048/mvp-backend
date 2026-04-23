import AppError from "../utils/AppError.js";
import { getExpiryTime } from "./otp.service.js";
import { isValidPhoneNumber } from "libphonenumber-js";
import { generate } from "otp-generator";
import * as otpRepo from "../repository/otp.respository.js";
import * as userRepo from "../repository/user.respository.js";
import bcrypt from "bcrypt";
import * as jwtService from "./jwt.service.js";

// SEND OTP
export const sendOTP = async({phone}) => {

    if (!phone || phone.length > 15) {  // we are sending full phone number including country code like +917011018266 
        throw new AppError("Correct phone number required!!", 400);
    }

    // Ensure E.164 format for India
    if (!isValidPhoneNumber(phone)){
        throw new AppError("Incorrect phone number", 400);
    }

    const otp = generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expireAt = getExpiryTime(5);

    // DB call
    const otpInsert = await otpRepo.upsertOtp(phone, hashedOtp, expireAt);

    // await client.messages.create({
    //   body: `Your OTP is ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phone,
    // });

    return otp;  // for developement env only

}

