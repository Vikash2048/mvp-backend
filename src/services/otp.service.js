import crypto from "crypto";

const generateOTP = (length = 6) => {
  const digits = "0123456789";
  let otp = "";

  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % 10];
  }
  return otp;
};

const hashOTP = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

const getExpiryTime = (minutes = 5) =>
  new Date(Date.now() + minutes * 60 * 1000);

export { generateOTP, hashOTP, getExpiryTime };
