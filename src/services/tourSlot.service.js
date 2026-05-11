import AppError from "../utils/AppError.js";
import * as slotRepo from "../repository/tourSlot.repository.js";
import * as tourRepo from "../repository/tourPackage.repository.js";


// CREATE SLOT
export const createTourSlot = async (data) => {
  // Ensure package exists
  const tour = await tourRepo.findById(data.tourPackageId);
  if (!tour) {
    throw new AppError("Invalid tour package", 400);
  }
  return await slotRepo.create(data);
};


// GET ALL SLOTS (with filter + pagination-ready)
export const getAllTourSlots = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const filters = {};

  if (query.tourPackageId) {
    filters.tourPackageId = query.tourPackageId;
  }

  const { data, total } = await slotRepo.findAll({ skip, limit, filters });
  return { total, page, limit, data };
};


// GET SLOT BY ID
export const getTourSlotById = async (id) => {
  const slot = await slotRepo.findById(id);

  if (!slot) {
    throw new AppError("Tour slot not found", 404);
  }

  return slot;
};


// UPDATE SLOT
export const updateTourSlot = async (id, updateData) => {
  // Optional: if packageId is being updated → validate
  if (updateData.tourPackageId) {
    const tour = await tourRepo.findById(updateData.tourPackageId);

    if (!tour) {
      throw new AppError("Invalid tour package", 400);
    }
  }

  const updated = await slotRepo.updateById(id, updateData);

  if (!updated) {
    throw new AppError("Tour slot not found", 404);
  }

  return updated;
};


//  DELETE SLOT
export const deleteTourSlot = async (id) => {
  const deleted = await slotRepo.deleteById(id);

  if (!deleted) {
    throw new AppError("Tour slot not found", 404);
  }
};