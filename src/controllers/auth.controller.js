import { catchAsync } from "../utils/catchAsync.js";
import * as authService from "../services/auth.service.js";
import AppError from "../utils/AppError.js";


/* VERIFY OTP */
export const verifyOTP = catchAsync(async(req, res, next) => {
  const device = req.headers["user-agent"];
  const ip = req.ip;
  
  req.log.info("OTP verification request received");
  const { accessToken, refreshToken, userObj } = await authService.verifyOTP(req.body, device, ip);
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

/* REFRESHED REFRESH TOKEN */
export const refreshedRefreshToken = catchAsync(async (req, res) => {
  const oldToken = req.cookies.refreshToken;

  if (!oldToken) {
    throw new AppError("No refresh token", 401);
  }

  const device = req.headers["user-agent"] || "unknown";
  const ip = req.ip;

  const { accessToken, refreshToken } =
    await authService.rotateRefreshToken(oldToken, device, ip);

  // 🍪 overwrite cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    token: accessToken,
  });
});

/* LOGOUT FROM ONE DEVICE */
export const logout = catchAsync(async(req, res, next) => {
  req.log.info("Logout request received");

  // support both mobile(body) and web(cookie)
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  console.log("token: ", token);
  console.log("req: ", req);

  if(!token){
    throw new AppError("Refresh token is required", 400);
  }

  // remove refresh token from db (multi device safe)
  await authService.logout(req.user._id, token);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  req.log.info("User logged out from current device");

  res.status(200).json({
    success: true,
    message: "logged out successfully",
  });
});

/* LOGOUT FROM ALL DEVICE */
export const logoutAllDevice = catchAsync(async(req, res, next) => {
  req.log.info("Logout from all device request received");

  await authService.logoutAll(req.user._id);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "logged out from all device",
  });
});
