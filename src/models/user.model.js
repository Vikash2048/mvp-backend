import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "User" },
    gender: String,
    AlternateNumber: Number,
    phone: { type: String, unique: true, required: true },
    email: { type: String, lowercase: true, trim: true },
    profileCompleted: { type: Boolean, default: false },
    isverifyed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    streak: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
      default: null,
    },
    highestStreak: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: {
        type: String,
        enum: ["system", "custom"],
        default: "system",
      },
      seed: String,
      style: String,
      url: String, // ONLY STORE CUSTOM IMAGE URL NOT DICEBEAR AVATAR
      publicId: String,  // Important in deletion
    },

    refreshTokens: [
      {
        token: String,
        device: String,
        ip: String,
        createdAt: {type: Date,default: Date.now}
      },
    ],
    date_of_birth: { type: Date },
  },
  { timestamps: true }, // Automatically manages createdAt and updatedAt
);

export default mongoose.model("User", userSchema);
