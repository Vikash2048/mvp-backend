import mongoose from "mongoose";
const therapistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  available_today: {
    type: Boolean,
    default: false,
    },
    price_per_session: {
    type: Number,
    required: true,
    },
    description: {
    type: String,
    maxlength: 500,
    },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  language: {
    type: [String],
    default: ["English", "Hindi"],
  },
  // Array of strings for easy filtering/tagging
  speciality: [
    {
      type: String,
      default: [
        "Anxiety",
        "Overthinking",
        "Phobias",
        "Sexual Well-being",
        "Stress",
        "Depression",
        "Trauma",
        "Relationship Issues",
      ],
    },
  ],
  // Array of objects for structured background
  education_and_experience: [
    {
      category: { type: String, enum: ["Education", "Experience"] },
      title: String, // e.g., "M.Sc. in Psychology" or "Clinical Lead"
      organization: String,
      year_or_duration: String,
    },
  ],
  available_slots: [
    {
      type: String, // e.g., "14:00", "15:30"
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "suspended"],
  },
  image: {
    type: String,
    default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  },
});


const Therapist = mongoose.model("Therapist", therapistSchema);

export default Therapist;