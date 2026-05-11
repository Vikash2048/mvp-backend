import RetreatBooking from "../models/retreatBooking.model.js";



export const create = async (data, session) => {
  const [booking] = await RetreatBooking.create( [data], { session } );
  return booking;
};


export const findAll = async (filters = {}) => {
  return await RetreatBooking.find(filters)
    .populate("tourPackageId", "title location images")
    .populate("tourSlotId", "startDate endDate")
    .sort({ createdAt: -1 })
    .lean();
};


export const findById = async (bookingId) => {
  return await RetreatBooking.findById(bookingId)
    .populate("tourPackageId")
    .populate("tourSlotId");
};


export const findByIdWithSession = async (
  bookingId,
  session
) => {
  return await RetreatBooking.findById(bookingId)
    .session(session);
};


export const updateStatus = async (
  bookingId,
  status,
  session = null
) => {
  return await RetreatBooking.findByIdAndUpdate(
    bookingId,
    { $set: { status } },
    {
      new: true,
      session,
    }
  );
};