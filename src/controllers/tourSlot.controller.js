import tourSlot from "../models/tourSlot.model.js";
import { catchAsync } from "../utils/catchAsync.js";

/* CREATE */
export const createTourSlot = catchAsync(async (req, res) => {
  req.log.info("Create tour slot request received");
  const data = await slotService.createTourSlot(req.body);
  res.status(201).json({ success: true, data });
})

/* GET ALL */
export const getAllTourSlots = catchAsync(async (req, res) => {
  req.log.info("Get all tour slots request received");
  const data = await slotService.getAllTourSlots(req.query);
  res.json({ success: true, data });
});

/* GET BY ID */
export const getTourSlotById = catchAsync(async (req, res) => {
  req.log.info("Get tour slot by id request received");
  const data = await slotService.getTourSlotById(req.params.id);
  res.json({ success: true, data });
});

/* UPDATE */
export const updateTourSlot = catchAsync(async (req, res) => {
  req.log.info("Update tour slot request received");
  const data = await slotService.updateTourSlot( req.params.id, req.body );
  res.json({ success: true, data });
});

/* DELETE */
export const deleteTourSlot = catchAsync(async (req, res) => {
  req.log.info("Delete tour slot request, received");
  await slotService.deleteTourSlot(req.params.id);
  res.status(204).json({success: true, message: "Slot deleted"});
});
/*

export const createTourSlot = async (req, res) => {
  try {
    logger.info({
      functionName: "createTourSlot",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Create tour slot handler hit");
    const slot = await tourSlot.create(req.body);
    
    res.status(201).json({
      success: true,
      message: "Tour slot created successfully",
      data: slot,
    });
  } catch (error) {
    logger.failure("Creating tour slot failed", error, {
      functionName: "createTourSlot",
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


export const getAllTourSlots = async (req, res) => {
  try {
    logger.info({
      functionName: "getAllTourSlots",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Get all tour slots handler hit");
    const filter = {};
    
    // Optional filter by package
    if (req.query.tourPackageId) {
      filter.tourPackageId = req.query.tourPackageId;
    }
    
    const slots = await tourSlot
    .find(filter)
    .populate("tourPackageId", "title location")
    .sort({ startDate: 1 });
    
    res.status(200).json({
      success: true,
      count: slots.length,
      data: slots,
    });
  } catch (error) {
    logger.failure("Fetching tour slots failed", error, {
      functionName: "getAllTourSlots",
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

export const getTourSlotById = async (req, res) => {
  try {
    logger.info({
      functionName: "getTourSlotById",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Get tour slot by id handler hit");
    const slot = await tourSlot
    .findById(req.params.id)
    .populate("tourPackageId", "title location pricePerSeat");
    
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Tour slot not found",
      });
    }
    
    res.status(200).json({
      success: true,
      data: slot,
    });
  } catch (error) {
    logger.failure("Fetching tour slot by id failed", error, {
      functionName: "getTourSlotById",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(400).json({
      success: false,
      message: "Invalid slot ID",
    });
  }
};

export const updateTourSlot = async (req, res) => {
  try {
    logger.info({
      functionName: "updateTourSlot",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Update tour slot handler hit");
    const slot = await tourSlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Tour slot not found",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Tour slot updated successfully",
      data: slot,
    });
  } catch (error) {
    logger.failure("Updating tour slot failed", error, {
      functionName: "updateTourSlot",
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

export const deleteTourSlot = async (req, res) => {
  try {
    logger.info({
      functionName: "deleteTourSlot",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Delete tour slot handler hit");
    const slot = await tourSlot.findByIdAndDelete(req.params.id);
    
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Tour slot not found",
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Tour slot deleted successfully",
    });
  } catch (error) {
    logger.failure("Deleting tour slot failed", error, {
      functionName: "deleteTourSlot",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(400).json({
      success: false,
      message: "Invalid slot ID",
    });
  }
};

*/