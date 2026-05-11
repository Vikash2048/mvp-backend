import AppError from "../utils/AppError.js";
import * as tourRepo from "../repository/tourPackage.repository.js";


// CREATE
export const createTourPackage = async (data) => {
    return await tourRepo.create(data);
};

// GET ALL PACKAGES (WITH PAGINATION)
export const getAllTourPackages = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const { data, total } = await tourRepo.findAll({ skip, limit });
    return { total, page, limit, data };
};

// GET TOUR BY ID
export const getTourPackageById = async (id) => {
    const tour = await tourRepo.findById(id);
    if(!tour) {
        throw new AppError("Tour package not found", 404);
    }
    return tour;
};

// UPDATE
export const updateTourPackage = async (id, updateData) => {
    const updated = await tourRepo.updateById(id, updateData);
    if(!updated) {
        throw new AppError("Tour package not found", 404);
    }
    return updated;
};

//DELETE
export const deleteTourPackage = async (id) => {
    const deleted = await tourRepo.deleteById(id);
    if(!deleted) {
        throw new AppError("Tour package not found", 404);
    }
};