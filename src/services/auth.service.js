import * as jwtService from "../services/jwt.service.js";
import * as otpRepo from "../repository/otp.respository.js";
import * as userRepo from "../repository/user.respository.js";

import bcrypt from "bcrypt";


/* VERIFY OTP */
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

    // for track multiple device storing ip with respective to refreshtoken
    const device = req.headers["user-agent"];
    const ip = req.ip;

    // pushing refresh token to user model in DB
    await userRepo.addRefreshToken(user.id, {
        token: refreshToken,
        device,
        ip,
        createdAt: new Date(),
    });

    console.log("user: ", user);

    const userObj = user.toObject();
    delete userObj.refreshTokens;

    //return access token
    return { accessToken, refreshToken, userObj }
}

/* AUTHENTICATE REFRESH TOKEN */
export const authenticateRefreshToken = async(refreshToken) => {
    let decode;

    try{
        decode = jwtService.verifyToken(refreshToken);
    } catch(err){
        throw new AppError("Refresh token expired or invalid!!");
    }

    const user = await userRepo.findById(decode.id);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
        throw new AppError("Invalid refresh token", 403);
    }

    const newAccessToken = generateAccessToken(user);

    return newAccessToken;
}

/* ROTATE REFRESH TOKEN */
export const rotateRefreshToken = async (oldToken, device, ip) => {
  let decoded;

  try {
    decoded = jwtService.verifyToken(oldToken);
  } catch {
    throw new AppError("Invalid or expired refresh token", 403);
  }

  const user = await userRepo.findById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 403);
  }

  // find token record
  const tokenRecord = user.refreshTokens.find(
    (t) => t.token === oldToken
  );

  // REUSE DETECTION
  if (!tokenRecord) {
    await userRepo.clearRefreshTokens(user._id);
    throw new AppError("Token reuse detected. All sessions revoked.", 403);
  }

  // remove old token
  await userRepo.removeRefreshToken(user._id, oldToken);

  const newAccessToken = jwtService.generateAccessToken(user);
  const newRefreshToken = jwtService.generateRefreshToken(user);

  // store new token with device info
  await userRepo.addRefreshToken(user._id, {
    token: newRefreshToken,
    device: tokenRecord.device || device,
    ip: ip,
    createdAt: new Date(),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};