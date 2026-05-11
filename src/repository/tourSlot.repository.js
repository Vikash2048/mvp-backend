import TourSlot from "../models/tourSlot.model.js";

// CREATE
export const create = async (data) => {
  return await TourSlot.create(data);
};

// FIND ALL (filter + pagination + populate)
export const findAll = async ({ skip, limit, filters = {} }) => {
  const query = { ...filters };

  const [data, total] = await Promise.all([
    TourSlot.find(query)
      .populate("tourPackageId", "title location pricePerSeat")
      .sort({ startDate: 1 }) // earliest first
      .skip(skip)
      .limit(limit)
      .lean(),

    TourSlot.countDocuments(query),
  ]);

  return { data, total };
};

// FIND BY ID
export const findById = async (id) => {
  return await TourSlot.findById(id)
    .populate("tourPackageId", "title location pricePerSeat")
    .lean();
};

// UPDATE
export const updateById = async (id, updateData) => {
  return await TourSlot.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("tourPackageId", "title location pricePerSeat")
    .lean();
};

// DELETE
export const deleteById = async (id) => {
  return await TourSlot.findByIdAndDelete(id);
};

//RESERVE SEAT 
export const reserveSeats = async (
  { tourSlotId, tourPackageId, seatsBooked },
  session
) => {
  return await TourSlot.findOneAndUpdate(
    {
      _id: tourSlotId,
      tourPackageId,
      isActive: true,

      // enough seats available
      availableSeats: { $gte: seatsBooked },
    },
    {
      $inc: {
        availableSeats: -seatsBooked,
        bookedSeats: seatsBooked,
      },
    },
    {
      new: true,
      session,
    }
  );
};

// RELEASE SEAT
export const releaseSeats = async (
  slotId,
  seatsToRelease,
  session
) => {
  return await TourSlot.findByIdAndUpdate(
    slotId,
    {
      $inc: {
        availableSeats: seatsToRelease,
        bookedSeats: -seatsToRelease,
      },
    },
    {
      new: true,
      session,
    }
  );
};


// availableSeats: {
//   type: Number,
//   required: true,
// },

// bookedSeats: {
//   type: Number,
//   default: 0,
// },