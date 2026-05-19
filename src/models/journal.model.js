import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    mood: {
      type: String,
      enum: [
        "HAPPY",
        "CALM",
        "SAD",
        "ANXIOUS",
        "ANGRY",
        "STRESSED",
      ],
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    images: [
      {
        type: String,
      },
    ],

    isPinned: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);



// ✅ TEXT SEARCH
journalSchema.index({
  title: "text",
  content: "text",
});



// ✅ USER + DATE QUERY OPTIMIZATION
journalSchema.index({
  createdBy: 1,
  createdAt: -1,
});



// ✅ TAG FILTER OPTIMIZATION
journalSchema.index({
  createdBy: 1,
  tags: 1,
});


export default mongoose.model( "Journal", journalSchema );