import express from "express";
import {
  createTourPackage,
  getAllTourPackages,
  getTourPackageById,
  updateTourPackage,
  deleteTourPackage,
} from "../controllers/retreats.controller.js";
import { createTourPackageSchema, validateBody } from "../middlewares/validation.js";


const router = express.Router();

// CREATE
router.post("/",validateBody(createTourPackageSchema), createTourPackage);

// READ
router.get("/", getAllTourPackages);
router.get("/:id", getTourPackageById);

// UPDATE
router.put("/:id", updateTourPackage);

// DELETE
router.delete("/:id", deleteTourPackage);

export default router;
