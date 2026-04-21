import Journal from "../models/journal.model.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger({ module: "journal-controller" });

export const createJournal = async (req, res) => {
  try {
    logger.info(
      {
        method: req.method,
        endpoint: `${req.method} ${req.originalUrl}`,
        ip: req.ip,
        bodyKeys: Object.keys(req.body || {}),
      },
      "Create journal requested",
    );
    const { content, mood, tags } = req.body;
    if (!content || !mood) {
      return res.status(400).json({
        message: "Content and mood are required",
      });
    }

    const journal = await Journal.create({
      userId: req?.user?.id || "65b999abc123456789000001", // from auth middleware
      content,
      mood,
      tags,
    });

    return res.status(201).json({
      message: "Journal created successfully",
      data: journal,
    });
  } catch (error) {
    logger.failure("Create journal failed", error, {
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllJournals = async (req, res) => {
  try {
    logger.info({
      functionName: "getAllJournals",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Get all journals handler hit");
    const journals = await Journal.find({
      userId: req?.user?.id || "65b999abc123456789000001",
      deletedAt: null,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Journals fetched successfully",
      count: journals.length,
      data: journals,
    });
  } catch (error) {
    logger.failure("Get journals failed", error, {
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getJournalById = async (req, res) => {
  try {
    logger.info({
      functionName: "getJournalById",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Get journal by id handler hit");
    const journal = await Journal.findOne({
      _id: req.params.id,
      userId: req?.user?.id || "65b999abc123456789000001",
      deletedAt: null,
    });

    if (!journal) {
      return res.status(404).json({
        message: "Journal not found",
      });
    }

    return res.status(200).json({
      data: journal,
    });
  } catch (error) {
    logger.failure("Get journal by id failed", error, {
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    return res.status(400).json({
      message: "Invalid journal ID",
    });
  }
};

export const updateJournalById = async (req, res) => {
  try {
    logger.info({
      functionName: "updateJournalById",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Update journal handler hit");
    const journal = await Journal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req?.user?.id || "65b999abc123456789000001",
        deletedAt: null,
      },
      {
        $set: req.body,
      },
      { new: true },
    );

    if (!journal) {
      return res.status(404).json({
        message: "Journal not found or access denied",
      });
    }

    return res.status(200).json({
      message: "Journal updated successfully",
      data: journal,
    });
  } catch (error) {
    logger.failure("Update journal failed", error, {
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    return res.status(400).json({
      message: "Invalid journal ID",
    });
  }
};

export const deleteJournalById = async (req, res) => {
  try {
    logger.info({
      functionName: "deleteJournalById",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Delete journal handler hit");
    const journal = await Journal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req?.user?.id || "65b999abc123456789000001",
        deletedAt: null,
      },
      {
        deletedAt: new Date(),
      },
      { new: true },
    );

    if (!journal) {
      return res.status(404).json({
        message: "Journal not found or access denied",
      });
    }

    return res.status(200).json({
      message: "Journal deleted successfully",
    });
  } catch (error) {
    logger.failure("Delete journal failed", error, {
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    return res.status(400).json({
      message: "Invalid journal ID",
    });
  }
};

export const getJournalTags = async (req, res) => {
  try {
    logger.info({
      functionName: "getJournalTags",
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    }, "Get journal tags handler hit");
    const tags = [
      "Gratitude",
      "Stress",
      "Exercise",
      "Family",
      "Work",
      "Relaxing",
      "Relationships",
    ];
    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags,
    });
  } catch (error) {
    logger.failure("Get journal tags failed", error, {
      method: req.method,
      endpoint: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
    });
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
