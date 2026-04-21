import express from "express";
import {
  createTourSlot,
  getAllTourSlots,
  getTourSlotById,
  updateTourSlot,
  deleteTourSlot,
} from "../controllers/retreatSlot.controller.js";
import { createTourSlotSchema, validateBody } from "../middlewares/validation.js";

const retreatSlotRouter = express.Router();

// CREATE
retreatSlotRouter.post("/",validateBody(createTourSlotSchema), createTourSlot);

// READ
retreatSlotRouter.get("/", getAllTourSlots);
retreatSlotRouter.get("/:id", getTourSlotById);
// UPDATE
retreatSlotRouter.put("/:id", updateTourSlot);

// DELETE
retreatSlotRouter.delete("/:id", deleteTourSlot);

export default retreatSlotRouter;