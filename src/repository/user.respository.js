import User from "../models/user.model.js";

export const findByPhone = (phone) => {
    return User.findOne({phone});
}

export const createNewUser = async (phone) => {
    const newUser = new User({phone, refreshTokens: []});
    await newUser.save();
    return newUser;
}

export const addRefreshToken = async (userId,token, device, ip) => {
    const userdbresponse = await User.updateOne({_id: userId}, {$push: {refreshTokens: {token, device: device, ip: ip}}});
}

export const findById = (userId) => {
    return User.findById(userId);
}

export const removeRefreshToken = async (userId, token) => {
    await User.findByIdAndUpdate(userId, {$pull: {refreshTokens: {token}}});
}

export const clearRefreshTokens = async (userId) => {
    await User.findByIdAndUpdate(userId, {$pull: {refreshTokens: []}});
}

export const updateAvatar = async (userId, avatarData) => {
    return await User.findByIdAndUpdate(userId, {
        avatar: avatarData,
    })
}

export const removeAvatar = async (userId) => {
    await User.findByIdAndUpdate(userId, {$pull: {avatar: {}}});
}

export const updateById = async (userId, data) => {
    return await User.findByIdAndUpdate(userId,
        { $set: data },
        { new: true, runValidators: true }
    ).select("-refreshTokens");
};