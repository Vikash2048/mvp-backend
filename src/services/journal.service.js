import AppError from "../utils/AppError.js";
import * as JournalRepo from "../repository/journal.respository.js";

// CREATE JOURNAL
export const createJournal = async(userID, data) => {
    return await JournalRepo.create({...data, createdBy: userId});
};

// GET ALL JOURNAL
export const getAllJournals = async(userId, query) => {
    const { page = 1, limit = 10, search, tag, sort="latest" } = query;
    const filters = { createdBy: userId };
    // search
    if (search) {
        filters.$text = { $search: search };
    }

    // tag filter
    if (tag) {
        filters.tags = tag;
    }

    // sorting
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") {
        sortOption = { createdAt: 1 };
    }

    const skip = (Number(page) -1)* Number(limit);
    
    const result = await JournalRepo.findAll({ filters, skip, limit: Number(limit), sortOption});

    return {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / limit ),
        journals: result.data,
    };
};

// GET SINGLE JOURNAL
export const getJournalById = async(userId, journalId) => {
    const journal = await JournalRepo.findById(journalId);

    if (!journal) {
        throw new AppError("journal not found",404);
    }

    // ownership check
    if (journal.createdBy.toString() !== userId) {
        throw new AppError("Access denied", 403);
    }

    return journal;
};

// UPDATE JOURNAL
export const updateJournalById = async(userId, journalId, updateData) => {
    const existingJournal = await JournalRepo.findById(journalId);

    if (!existingJournal) {
        throw new AppError("Journal not found", 404);
    }

    // ownership check
    if (existingJournal.createdBy.toString() !== userId) {
        throw new AppError("Access denied", 403);
    }

    return await JournalRepo.updateById(journalId, updateData);
};

// DELETE JOURNAL
export const deleteJournalById = async(userId, journalId) => {
    const existingJournal = await JournalRepo.findById(journalId);

    if (!existingJournal) {
        throw new AppError("Journal not found", 404);
    }

    // ownership check
    if (existingJournal.createdBy.toString() !== userId) {
        throw new AppError("Access denied", 403);
    }

    await JournalRepo.deleteById(journalId);
};

// GET JOURNAL TAGS
export const getJournalTags = async(userId) => {
    return await JournalRepo.getTags(userId);
};