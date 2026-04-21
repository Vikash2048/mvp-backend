import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    mood: {
      type: String,
      required: true,
      enum: ["HAPPY", "NEUTRAL", "SAD", "ANXIOUS","OK","ANGRY","OTHER"],
    },
    tags: {
      type: [String],
      default: [],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

export default mongoose.model("Journal", JournalSchema);
