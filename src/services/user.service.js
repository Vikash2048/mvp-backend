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

// VERIFY OTP

export const verifyOTP = async({phone, otp}) => {
    if(!phone || !otp){
        throw new AppError("Empty field detected!!", 400);
    }

    const otpRecord = await otpRepo.findByPhone(phone);
    if (!otpRecord) {
        throw new AppError("OTP not found!!", 400);
    }

    if (Date.now() > otpRecord.expiresAt) {
        await otpRepo.deleteById(otpRecord._id);
        throw new AppError("OTP expired", 400);
    }

    // Note: Otp is stored in hashed form so compair otp after hash only
    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValid) {
        throw new AppError("Invalid OTP", 400);
    }

    await otpRepo.deleteById(otpRecord._id);

    //handle user creation and token generation
    let user = await userRepo.findByPhone(phone);
    if (!user){
        user = await userRepo.createNewUser(phone);
    }

    const accessToken = jwtService.generateAccessToken(user);
    const refreshToken = jwtService.generateRefreshToken(user);

    // pushing refresh token to user model in DB
    await userRepo.insertRefreshToken(user.id, refreshToken);

    console.log("user: ", user);

    const userObj = user.toObject();
    delete userObj.refreshTokens;

    //return access token
    return { accessToken, refreshToken, userObj }
}
