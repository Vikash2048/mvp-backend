import express from "express";
import {
  createTourSlot,
  getAllTourSlots,
  getTourSlotById,
  updateTourSlot,
  deleteTourSlot,
} from "../controllers/tourSlot.controller.js";
import { createTourSlotSchema, validateBody, updateTourSlotSchema } from "../middlewares/validation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllTourSlots)
  .post(
    authMiddleware,
    isAdmin,
    validateBody(createTourSlotSchema),
    createTourSlot
  );

router
  .route("/:id")
  .get(getTourSlotById)
  .patch(
    authMiddleware,
    isAdmin,
    validateBody(updateTourSlotSchema),
    updateTourSlot
  )
  .delete(authMiddleware, isAdmin, deleteTourSlot);

/*
// CREATE
retreatSlotRouter.post("/",validateBody(createTourSlotSchema), createTourSlot);

// READ
retreatSlotRouter.get("/", getAllTourSlots);
retreatSlotRouter.get("/:id", getTourSlotById);
// UPDATE
retreatSlotRouter.put("/:id", updateTourSlot);

// DELETE
retreatSlotRouter.delete("/:id", deleteTourSlot);
*/

export default router;