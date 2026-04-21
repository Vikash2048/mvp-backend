import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import RefreshToken from "../../models/refreshToken.model.js";

const generateTokens = async (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await RefreshToken.create(
        {
            userId,
            tokenHash: refreshTokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    );

    return { accessToken, refreshToken };
}

export { generateTokens };