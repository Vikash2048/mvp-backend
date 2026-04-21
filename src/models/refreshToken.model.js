import mongoose from "mongoose";

const refreshTokenSchemna = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        tokenHash: { 
            type: String, 
            required: true 
        },
        expiresAt: Date,
        deviceId: String,
        // ipAddress: String, 
        // userAgent: String, 
        revoked: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }
);

export default mongoose.model("RefreshToken", refreshTokenSchemna);