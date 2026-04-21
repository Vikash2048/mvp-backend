import express from "express";
import { createJournal, deleteJournalById, getAllJournals, getJournalById, getJournalTags, updateJournalById } from "../controllers/journal.controller.js";
import { createJournalSchema, updateJournalSchema, validateBody } from "../middlewares/validation.js";
import { authMiddleware } from "../utils/jwt.util.js";

const journalRouter = express.Router();

journalRouter.post("/create", authMiddleware, validateBody(createJournalSchema), createJournal);
journalRouter.get("/", authMiddleware, getAllJournals);
journalRouter.get("/tags", getJournalTags);
journalRouter.get("/:id", authMiddleware,getJournalById);
journalRouter.patch("/:id", authMiddleware, validateBody(updateJournalSchema), updateJournalById);
journalRouter.delete("/:id", authMiddleware, deleteJournalById);
export default journalRouter;