import mongoose from "mongoose";

const therapySessionBookingSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      therapistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Therapist",
        required: true,
        index: true,
      },
      
      slotDate: {
        type: Date,
        required: true,
        index: true,
      },

      slotTime: {
        type: String,
        required: true,
      },

      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },

      /*
       * USER DETAILS SNAPSHOT
       * IMPORTANT:
       * snapshot store because therapist/user
       * data may change later
       */
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      age: {
        type: Number,
      },

      gender: {
        type: String,
        enum: [
          "MALE",
          "FEMALE",
          "OTHER",
        ],
      },

      concern: {
        type: String,
        trim: true,
        maxlength: 1000,
      },

      languagePreference: {
        type: String,
      },

      /*
       * BOOKING STATUS
       */
      bookingStatus: {
        type: String,
        enum: [
          "PENDING",
          "CONFIRMED",
          "CANCELLED",
          "FAILED",
          "EXPIRED",
        ],
        default: "PENDING",
        index: true,
      },

      /*
       * PAYMENT STATUS
       */
      paymentStatus: {
        type: String,
        enum: [
          "PENDING",
          "PAID",
          "FAILED",
          "REFUNDED",
        ],
        default: "PENDING",
        index: true,
      },

      /*
       * PAYMENT DETAILS
       */
      paymentProvider: {
        type: String,
        enum: [
          "RAZORPAY",
          "STRIPE",
          null,
        ],
        default: null,
      },

      paymentOrderId: {
        type: String,
        default: null,
      },

      paymentId: {
        type: String,
        default: null,
      },

      transactionId: {
        type: String,
        default: null,
      },

      paymentAmount: {
        type: Number,
        required: true,
      },

      currency: {
        type: String,
        default: "INR",
      },

      /*
       * TEMPORARY SLOT LOCK
       * auto expire pending bookings
       */
      expiresAt: {
        type: Date,
        default: () =>
          new Date(
            Date.now() +
              10 * 60 * 1000
          ),
        index: true,
      },

      /*
       * CANCELLATION
       */
      cancelledAt: {
        type: Date,
        default: null,
      },

      cancellationReason: {
        type: String,
        default: null,
      },

      /*
       * REFUND
       */
      refundId: {
        type: String,
        default: null,
      },

      refundAmount: {
        type: Number,
        default: 0,
      },

      refundedAt: {
        type: Date,
        default: null,
      },

      /*
       * INTERNAL NOTES
       */
      adminNotes: {
        type: String,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );



/*
 * IMPORTANT INDEX
 *
 * prevents double booking
 */
therapySessionBookingSchema.index(
  {
    therapistId: 1,
    slotDate: 1,
    slotTime: 1,
  }
);



/*
 * QUICK FILTERS
 */
therapySessionBookingSchema.index({
  userId: 1,
  bookingStatus: 1,
});

therapySessionBookingSchema.index({
  therapistId: 1,
  bookingStatus: 1,
});



export default mongoose.model(
  "TherapySessionBooking",
  therapySessionBookingSchema
);









// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User", // References your User model
//     required: true,
//   },
//   therapistId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Therapist", // References the Therapist model we created
//     required: true,
//   },
//   concern: {
//     type: String,
//     required: true,
//     maxlength: 1000,
//     trim: true,
//   },
//   language_preference: {
//     type: String,
//     required: true,
//     enum: ["English", "Hindi", "Marathi", "Punjabi", "Tamil", "Bengali"],
//   },
//   total_amount: {
//     type: Number,
//     required: true,
//   },
//   slot_date: {
//     type: Date, // Format: YYYY-MM-DD
//     required: true,
//   },
//   slot_time: {
//     type: String, // Format: "14:00"
//     required: true,
//   },
//   booking_status: {
//     type: String,
//     enum: ["pending", "confirmed", "cancelled", "completed"],
//     default: "pending",
//   },
//   payment_status: {
//     type: String,
//     enum: ["unpaid", "paid", "refunded"],
//     default: "unpaid",
//   },
//   created_at: {
//     type: Date,
//     default: Date.now,
//   },
// });



// const Booking = mongoose.model("therapistBooking", bookingSchema);
// export default Booking;
