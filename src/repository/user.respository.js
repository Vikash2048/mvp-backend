import User from "../models/user.model.js";

export const findByPhone = (phone) => {
    return User.findOne({phone});
}

export const createNewUser = (phone) => {
    const newUser = new User({phone, refreshTokens: []});
    newUser.save();
    return newUser;
}

export const addRefreshToken = (userId, refreshToken, device, ip, createdAt ) => {
    User.updateOne({_id: userId}, {$set: {refreshTokens: {token: refreshToken, device: device, ip: ip, createdAt}}});
}

export const findById = (userId) => {
    return user = user.find({_id: userId});
}

export const removeRefreshToken = (userId, token) => {
    User.updateOne({_id: userId}, {$pull: {refreshToken: token}});
}
