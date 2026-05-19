import TherapySessionBooking from "../models/therapySessionBooking.model.js";



/* ------------------------------------------------ */
/* CREATE BOOKING */
/* ------------------------------------------------ */

export const create =
  async (payload, session = null) => {
    return await TherapySessionBooking.create(
      [payload],
      { session }
    ).then((res) => res[0]);
  };



/* ------------------------------------------------ */
/* FIND BY ID */
/* ------------------------------------------------ */

export const findById =
  async (bookingId) => {
    return await TherapySessionBooking
      .findById(bookingId)
      .populate({
        path: "therapistId",

        select:
          "name image speciality rating",
      })
      .populate({
        path: "userId",

        select:
          "name email phone image",
      });
  };



/* ------------------------------------------------ */
/* GET USER BOOKINGS */
/* ------------------------------------------------ */

export const findAll =
  async ({
    filters,
    skip = 0,
    limit = 10,
  }) => {
    const [data, total] =
      await Promise.all([
        TherapySessionBooking
          .find(filters)
          .populate({
            path: "therapistId",

            select:
              "name image speciality rating",
          })
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        TherapySessionBooking.countDocuments(
          filters
        ),
      ]);



    return {
      data,
      total,
    };
  };



/* ------------------------------------------------ */
/* SLOT CONFLICT CHECK */
/* ------------------------------------------------ */

export const findActiveSlotBooking =
  async ({
    therapistId,
    slotDate,
    slotTime,
  }) => {
    return await TherapySessionBooking.findOne(
      {
        therapistId,

        slotDate,

        slotTime,

        bookingStatus: {
          $in: [
            "PENDING",
            "CONFIRMED",
          ],
        },

        expiresAt: {
          $gt: new Date(),
        },
      }
    );
  };



/* ------------------------------------------------ */
/* UPDATE BOOKING */
/* ------------------------------------------------ */

export const updateById =
  async (
    bookingId,
    updatePayload,
    session = null
  ) => {
    return await TherapySessionBooking
      .findByIdAndUpdate(
        bookingId,
        {
          $set: updatePayload,
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );
  };



/* ------------------------------------------------ */
/* CANCEL BOOKING */
/* ------------------------------------------------ */

export const cancelBooking =
  async (
    bookingId,
    reason = null
  ) => {
    return await TherapySessionBooking
      .findByIdAndUpdate(
        bookingId,
        {
          $set: {
            bookingStatus:
              "CANCELLED",

            cancelledAt:
              new Date(),

            cancellationReason:
              reason,
          },
        },
        {
          new: true,
        }
      );
  };



/* ------------------------------------------------ */
/* CONFIRM BOOKING */
/* ------------------------------------------------ */

export const confirmBooking =
  async (
    bookingId,
    paymentData = {}
  ) => {
    return await TherapySessionBooking
      .findByIdAndUpdate(
        bookingId,
        {
          $set: {
            bookingStatus:
              "CONFIRMED",

            paymentStatus:
              "PAID",

            ...paymentData,
          },
        },
        {
          new: true,
        }
      );
  };



/* ------------------------------------------------ */
/* EXPIRE PENDING BOOKINGS */
/* ------------------------------------------------ */

export const expirePendingBookings =
  async () => {
    return await TherapySessionBooking
      .updateMany(
        {
          bookingStatus:
            "PENDING",

          expiresAt: {
            $lte: new Date(),
          },
        },
        {
          $set: {
            bookingStatus:
              "EXPIRED",
          },
        }
      );
  };



/* ------------------------------------------------ */
/* WEBHOOK IDEMPOTENCY */
/* ------------------------------------------------ */

export const findByPaymentId =
  async (paymentId) => {
    return await TherapySessionBooking
      .findOne({
        paymentId,
      });
  };

export const findActiveBookingsForAvailability =
  async (
    therapistId,
    fromDate
  ) => {
    return await TherapySessionBooking.find(
      {
        therapistId,

        slotDate: {
          $gte: fromDate,
        },

        bookingStatus: {
          $in: [
            "PENDING",
            "CONFIRMED",
          ],
        },

        /*
         * pending lock valid
         */
        $or: [
          {
            bookingStatus:
              "CONFIRMED",
          },

          {
            bookingStatus:
              "PENDING",

            expiresAt: {
              $gt: new Date(),
            },
          },
        ],
      }
    ).select(
      "slotDate slotTime bookingStatus expiresAt"
    );
  };