import otpModel from "../models/otp.model.js";

export const upsertOtp = (phone, hashedOtp, expireAt) => {
    // using findOneAndUpdate instead of create 
    return otpModel.findOneAndUpdate(
      { phone},
      { otpHash: hashedOtp, expiresAt: expireAt },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
}

export const findByPhone = (phone) => {
    return otpModel.findOne({phone});
}

export const deleteById = (_id) => {
    return otpModel.deleteOne({_id: _id});
}