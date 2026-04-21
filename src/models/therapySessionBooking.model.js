import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References your User model
    required: true,
  },
  therapistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Therapist", // References the Therapist model we created
    required: true,
  },
  concern: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true,
  },
  language_preference: {
    type: String,
    required: true,
    enum: ["English", "Hindi", "Marathi", "Punjabi", "Tamil", "Bengali"],
  },
  total_amount: {
    type: Number,
    required: true,
  },
  slot_date: {
    type: Date, // Format: YYYY-MM-DD
    required: true,
  },
  slot_time: {
    type: String, // Format: "14:00"
    required: true,
  },
  booking_status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  payment_status: {
    type: String,
    enum: ["unpaid", "paid", "refunded"],
    default: "unpaid",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});



const Booking = mongoose.model("therapistBooking", bookingSchema);
export default Booking;
