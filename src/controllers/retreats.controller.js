import TourPackage from "../models/tourPackage.model.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger({ module: "retreats-controller" });

/* CREATE tour package */
export const createTourPackage = catchAsync(async (req, res) => {
  req.log.info("Create tour package request received");
  const data = await tourService.createTourPackage(req.body);
  res.status(201).json({success: true, data});
});

/* GET ALL */
export const getAllTourPackages = catchAsync(async (req, res) => {
  req.log.info("Get all tour packages request received");
  const data = await tourService.getAllTourPackages(req.query);
  res.json({success: true, data});
});

/* GET BY ID */
export const getTourPackageById = catchAsync(async (req, res) => {
  req.log.info("Get tour package by id request received");
  const data = await tourService.getTourPackageById(req.params.id);
  res.json({success: true, data});
});

/* UPDATE */
export const updateTourPackage = catchAsync(async (req, res) => {
  req.log.info("Update tour package hit");
  const data = await tourService.updateTourPackage( req.params.id, req.body );
  res.json({success: true, data});
});

/* DELETE */
export const deleteTourPackage = catchAsync(async (req, res) => {
  req.log.info("Delete tour package hit");
  await tourService.deleteTourPackage(req.params.id);
  res.status(204).json({success: true, message: "Package deleted"});
});

export const createTourPackage = async (req, res) => {
  try {
    logger.info(
      {
        functionName: "createTourPackage",
        method: req.method,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
      },
      "Create tour package handler hit",
    );
    const tour = await TourPackage.create(req.body);

    res.status(201).json({
      success: true,
      message: "Tour package created successfully",
      data: tour,
    });
  } catch (error) {
    logger.failure("Creating tour package failed", error, {
      functionName: "createTourPackage",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET all tour packages
 */
export const getAllTourPackages = async (req, res) => {
  try {
    logger.info(
      {
        functionName: "getAllTourPackages",
        method: req.method,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
      },
      "Get all tour packages handler hit",
    );
    const tours = await TourPackage.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tours.length,
      data: tours,
    });
  } catch (error) {
    logger.failure("Fetching tour packages failed", error, {
      functionName: "getAllTourPackages",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET tour package by ID
 */
export const getTourPackageById = async (req, res) => {
  try {
    logger.info(
      {
        functionName: "getTourPackageById",
        method: req.method,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
      },
      "Get tour package by id handler hit",
    );
    const { id } = req.params;

    const tour = await TourPackage.findById(id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour package not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tour,
    });
  } catch (error) {
    logger.failure("Fetching tour package by id failed", error, {
      functionName: "getTourPackageById",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(400).json({
      success: false,
      message: "Invalid tour package ID",
    });
  }
};

/**
 * UPDATE tour package
 */
export const updateTourPackage = async (req, res) => {
  try {
    logger.info(
      {
        functionName: "updateTourPackage",
        method: req.method,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
      },
      "Update tour package handler hit",
    );
    const { id } = req.params;

    const updatedTour = await TourPackage.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour package not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour package updated successfully",
      data: updatedTour,
    });
  } catch (error) {
    logger.failure("Updating tour package failed", error, {
      functionName: "updateTourPackage",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE tour package
 */
export const deleteTourPackage = async (req, res) => {
  try {
    logger.info(
      {
        functionName: "deleteTourPackage",
        method: req.method,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
      },
      "Delete tour package handler hit",
    );
    const { id } = req.params;

    const deletedTour = await TourPackage.findByIdAndDelete(id);

    if (!deletedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour package not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour package deleted successfully",
    });
  } catch (error) {
    logger.failure("Deleting tour package failed", error, {
      functionName: "deleteTourPackage",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(400).json({
      success: false,
      message: "Invalid tour package ID",
    });
  }
};
