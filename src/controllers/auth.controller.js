import { catchAsync } from "../utils/catchAsync.js";
import * as authService from "../services/auth.service.js"



/* VERIFY OTP */
export const verifyOTP = catchAsync(async(req, res, next) => {
  req.log.info("OTP verification request received");
  const { accessToken, refreshToken, userObj } = await authService.verifyOTP(req.body);
  req.log.info("OTP verification successfull");

  // secure cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, //HTTPS Only
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  res.status(200).json({
    success: true,
    data: {accessToken, userObj},
    message: "OTP verification successfull",
    requestId: req.requestId,
  })
})

/* GENERATE ACCESS TOKEN USING REFRESH TOKEN */
export const refreshedAccessToken = catchAsync(async(req, res, next) => {
  req.log.info("Access token regeneration request received");
  // get token cookie
  const refreshToken = req.query.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token missing!!", 400);
  }

  const accessToken = await authService.authenticateRefreshToken(refreshToken);

  req.log.info("New access token generated");

  res.status(200).json({
    success: true,
    data: accessToken,
    message: "Access token refresh successfully",
    requestId: req.requestId,
  })

})
