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
      type: String,
      default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },

    refreshTokens: [
      {
        token: String,
        device: String,
        ip: String,
        createdAt: Date
      },
    ],
    date_of_birth: { type: Date },
  },
  { timestamps: true }, // Automatically manages createdAt and updatedAt
);

export default mongoose.model("User", userSchema);
