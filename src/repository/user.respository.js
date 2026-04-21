import User from "../models/user.model.js";

export const findByPhone = (phone) => {
    return User.findOne({phone});
}

export const createNewUser = (phone) => {
    const newUser = new User({phone, refreshTokens: []});
    newUser.save();
    return newUser;
}

export const insertRefreshToken = (id, refreshToken) => {
    User.updateOne({_id: id}, {$set: {refreshTokens: refreshToken}});
}

export const findById = (id) => {
    return user = user.find({_id: id});
}