import mongoose from "mongoose";

const therapistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    image: {
      type: String,
      default:
        "https://api.dicebear.com/7.x/avataaars/png?seed=therapist",
    },

    pricePerSession: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    languages: [
      {
        type: String,
        trim: true,
      },
    ],

    specialties: [
      {
        type: String,
        trim: true,
      },
    ],

    educationAndExperience: [
      {
        category: {
          type: String,
          enum: ["Education", "Experience"],
        },
        title: String,
        organization: String,
        yearOrDuration: String,
      },
    ],

    weeklyAvailability: [
      {
        dayOfWeek: {
          type: Number,
          min: 0,
          max: 6,
        },
        startTime: String,
        endTime: String,
      },
    ],

    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);



// ✅ SEARCH INDEX
therapistSchema.index({
  name: "text",
  specialties: "text",
});



// ✅ FILTER INDEX
therapistSchema.index({
  status: 1,
  rating: -1,
});



export default mongoose.model( "Therapist", therapistSchema );