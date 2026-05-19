import * as therapistBookingService
  from "../services/therapistBooking.service.js";

import { createLogger }
  from "../utils/logger.js";



const logger = createLogger({
  module:
    "therapist-booking-controller",
});



/* ------------------------------------------------ */
/* CREATE BOOKING */
/* ------------------------------------------------ */

export const createBooking =
  async (req, res, next) => {
    try {
      logger.info(
        {
          functionName:
            "createBooking",

          method:
            req.method,

          endpoint:
            `${req.method} ${req.originalUrl}`,

          ip:
            req.ip,
        },
        "Therapist booking create handler hit"
      );



      const booking =
        await therapistBookingService.createBooking(
          req.user.id,
          req.body
        );



      return res.status(201).json({
        success: true,

        message:
          "Booking created successfully",

        data: booking,
      });
    } catch (error) {
      logger.failure(
        "Creating therapist booking failed",
        error,
        {
          functionName:
            "createBooking",

          method:
            req.method,

          endpoint:
            `${req.method} ${req.originalUrl}`,

          ip:
            req.ip,
        }
      );

      next(error);
    }
  };



/* ------------------------------------------------ */
/* GET MY BOOKINGS */
/* ------------------------------------------------ */

export const getMyBookings =
  async (req, res, next) => {
    try {
      logger.info(
        {
          functionName:
            "getMyBookings",

          method:
            req.method,

          endpoint:
            `${req.method} ${req.originalUrl}`,

          ip:
            req.ip,
        },
        "Get therapist bookings handler hit"
      );



      const result =
        await therapistBookingService.getMyBookings(
          req.user.id,
          req.query
        );



      return res.status(200).json({
        success: true,

        ...result,
      });
    } catch (error) {
      logger.failure(
        "Fetching therapist bookings failed",
        error,
        {
          functionName:
            "getMyBookings",

          method:
            req.method,

          endpoint:
            `${req.method} ${req.originalUrl}`,

          ip:
            req.ip,
        }
      );

      next(error);
    }
  };



/* ------------------------------------------------ */
/* GET BOOKING BY ID */
/* ------------------------------------------------ */

export const getBookingById =
  async (req, res, next) => {
    try {
      logger.info(
        {
          functionName:
            "getBookingById",

          method:
            req.method,

          endpoint:
            `${req.method} ${req.originalUrl}`,

          ip:
            req.ip,
        },
        "Get therapist booking by id handler hit"
      );



      const booking =
        await therapistBookingService.getBookingById(
          req.user.id,
          req.params.id
        );



      return res.status(200).json({
        success: true,

        data: booking,
      });
    } catch (error) {
      logger.failure(
        "Fetching therapist booking failed",
        error,
        {
          functionName:
            "getBookingById",

          method:
            req.method,

          endpoint:
            `${req.method} ${req.originalUrl}`,

          ip:
            req.ip,
        }
      );

      next(error);
    }
  };



/* ------------------------------------------------ */
/* CONFIRM BOOKING */
/* ------------------------------------------------ */

export const confirmBooking =
  async (req, res, next) => {
    try {
      logger.info(
        {
          functionName:
            "confirmBooking",

          method:
            req.method,

          endpoint:
            `${req.method} ${req.originalUrl}`,

          ip:
            req.ip,
        },
        "Confirm therapist booking handler hit"
      );



      const booking =
        await therapistBookingService.confirmBooking(
          req.params.id,
          req.body
        );



      return res.status(200).json({
        success: true,

        message:
          "Booking confirmed successfully",

        data: booking,
      });
    } catch (error) {
      logger.failure(
        "Confirming therapist booking failed",
        error,
        {
          functionName:
            "confirmBooking",

          method:
            req.method,

          endpoint:
            `${req.method} ${req.originalUrl}`,

          ip:
            req.ip,
        }
      );

      next(error);
    }
  };



/* ------------------------------------------------ */
/* CANCEL BOOKING */
/* ------------------------------------------------ */

export const cancelBooking =
  async (req, res, next) => {
    try {
      logger.info(
        {
          functionName:
            "cancelBooking",

          method:
            req.method,

          endpoint:
            `${req.method} ${req.originalUrl}`,

          ip:
            req.ip,
        },
        "Cancel therapist booking handler hit"
      );



      const booking =
        await therapistBookingService.cancelBooking(
          req.user.id,
          req.params.id,
          req.body.reason
        );



      return res.status(200).json({
        success: true,

        message:
          "Booking cancelled successfully",

        data: booking,
      });
    } catch (error) {
      logger.failure(
        "Cancelling therapist booking failed",
        error,
        {
          functionName:
            "cancelBooking",

          method:
            req.method,

          endpoint:
            `${req.method} ${req.originalUrl}`,

          ip:
            req.ip,
        }
      );

      next(error);
    }
  };


export const getTherapistAvailability =
  async (req, res, next) => {
    try {
      const result =
        await therapistBookingService.getTherapistAvailability(
          req.params.therapistId,
          req.query.days
        );



      return res.status(200).json({
        success: true,

        data: result,
      });
    } catch (error) {
      next(error);
    }
  };



// import Therapist from "../models/therapist.model.js";
// import Booking from "../models/therapySessionBooking.model.js";
// import {  sendTherapyRequestMail } from "../utils/mailService.js";
// import { createLogger } from "../utils/logger.js";

// const logger = createLogger({ module: "therapist-booking-controller" });

// // CREATE: New Booking with Double-Booking Check
// export const createBooking = async (req, res) => {
//   try {
//     logger.info({
//       functionName: "createBooking",
//       method: req.method,
//       endpoint: `${req.method} ${req.originalUrl}`,
//       ip: req.ip,
//     }, "Therapist booking create handler hit");
//     const {
//       therapistId,
//       slot_date,
//       slot_time,
//       age,
//       gender,
//       phone,
//       concern,
//       language_preference,
//     } = req.body;

  
//     // Check if the slot is already taken for this therapist
//     const existingBooking = await Booking.findOne({
//       therapistId,
//       slot_date,
//       slot_time,
//       booking_status: { $ne: "cancelled" }, // Ignore cancelled bookings
//     });

//     if (existingBooking) {
//       return res.status(400).json({
//         message: "This slot is already booked. Please choose another time.",
//       });
//     }
//     const newBooking = await Booking.create({
//       ...req.body,
//       userId: req.user.id,
//     });
//     const therapistData = await Therapist.findById(therapistId);
//     await sendTherapyRequestMail(
//       req.body.email,
//       req.body.name,
//       therapistData.name,
//       newBooking.slot_time,
//       newBooking.slot_date.toDateString(),
//       age,
//       gender,
//       phone,
//       concern,
//       language_preference,
//     );
//     res.status(201).json(newBooking);
//   } catch (error) {
//     logger.failure("Creating therapist booking failed", error, {
//       functionName: "createBooking",
//       method: req.method,
//       endpoint: `${req.method} ${req.originalUrl}`,
//       ip: req.ip,
//     });
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getAllBookings = async (req, res) => {
//   try {
//     logger.info({
//       functionName: "getAllBookings",
//       method: req.method,
//       endpoint: `${req.method} ${req.originalUrl}`,
//       ip: req.ip,
//     }, "Therapist booking list handler hit");
//     const { therapistId, status } = req.query;
//     const userId = req.user.id;
//     // Dynamically build the filter object
//     let filter = {};

//     if (userId) {
//       filter.userId = userId;
//     }

//     if (therapistId) {
//       filter.therapistId = therapistId;
//     }

//     if (status) {
//       filter.booking_status = status;
//     }

//     const bookings = await Booking.find(filter)
//       .populate({
//         path: "userId",
//         select: "name email image phone", // Exclude password/sensitive info
//       })
//       .populate({
//         path: "therapistId",
//         select:
//           "name image speciality price_per_session rating language description",
//       })
//       .sort({ slot_date: 1, slot_time: 1 });

//     res.status(200).json({
//       results: bookings.length,
//       data: bookings,
//     });
//   } catch (error) {
//     logger.failure("Fetching therapist bookings failed", error, {
//       functionName: "getAllBookings",
//       method: req.method,
//       endpoint: `${req.method} ${req.originalUrl}`,
//       ip: req.ip,
//     });
//     res.status(500).json({ error: error.message });
//   }
// };
// // SINGLE: Get booking details by ID with full population
// export const getBookingById = async (req, res) => {
//   try {
//     logger.info({
//       functionName: "getBookingById",
//       method: req.method,
//       endpoint: `${req.method} ${req.originalUrl}`,
//       ip: req.ip,
//     }, "Therapist booking detail handler hit");
//     const booking = await Booking.findById(req.params.id)
//       .populate({
//         path: "userId",
//         select: "name email image phone", // Exclude password/sensitive info
//       })
//       .populate({
//         path: "therapistId",
//         select:
//           "name image speciality price_per_session rating language description",
//       });

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     res.status(200).json({
//       success: true,
//       data: booking,
//     });
//   } catch (error) {
//     // This catches cases where the ID format is malformed
//     logger.failure("Fetching therapist booking by id failed", error, {
//       functionName: "getBookingById",
//       method: req.method,
//       endpoint: `${req.method} ${req.originalUrl}`,
//       ip: req.ip,
//     });
//     res.status(400).json({
//       success: false,
//       message: "Invalid Booking ID format",
//       error: error.message,
//     });
//   }
// };

// export const cancelBooking = async (req, res) => {
//   try {
//     logger.info({
//       functionName: "cancelBooking",
//       method: req.method,
//       endpoint: `${req.method} ${req.originalUrl}`,
//       ip: req.ip,
//     }, "Therapist booking cancel handler hit");
//     const { id } = req.params;

//     const cancelled = await Booking.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           booking_status: "cancelled",
//           payment_status: "refunded", // Optional logic: auto-set to refunded
//         },
//       },
//       { new: true },
//     );

//     if (!cancelled) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     res.status(200).json({
//       message: "Booking has been cancelled successfully",
//       data: cancelled,
//     });
//   } catch (error) {
//     logger.failure("Cancelling therapist booking failed", error, {
//       functionName: "cancelBooking",
//       method: req.method,
//       endpoint: `${req.method} ${req.originalUrl}`,
//       ip: req.ip,
//     });
//     res.status(500).json({ error: error.message });
//   }
// };

// export const confirmedBooking = async (req, res) => {
//   try {
//     logger.info({
//       functionName: "confirmedBooking",
//       method: req.method,
//       endpoint: `${req.method} ${req.originalUrl}`,
//       ip: req.ip,
//     }, "Therapist booking confirm handler hit");
//     const { id } = req.params;

//     const confirmed = await Booking.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           booking_status: "confirmed",
//           payment_status: "paid", // Optional logic: auto-set to refunded
//         },
//       },
//       { new: true },
//     );

//     if (!confirmed) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     res.status(200).json({
//       message: "Booking has been confirmed successfully",
//       data: confirmed,
//     });
//   } catch (error) {
//     logger.failure("Confirming therapist booking failed", error, {
//       functionName: "confirmedBooking",
//       method: req.method,
//       endpoint: `${req.method} ${req.originalUrl}`,
//       ip: req.ip,
//     });
//     res.status(500).json({ error: error.message });
//   }
// };
