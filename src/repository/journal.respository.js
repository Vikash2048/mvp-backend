import journal from "../models/journal.model.js";

// CREATE
export const create = async(data) => {
    return await journal.create(data);
};

// FIND ALL
export const findAll = async({ filters, skip, limit, sortOption }) => {
    const [data, total] = await Promise.all([journal.find(filters).sort(sortOption).skip(skip).limit(limit).lean(), journal.countDocuments(filters)]);

    return { data, total };
};

// FIND BY ID
export const findById = async(journalId) => {
    return await journal.findById(journalId);
};

// UPDATE
export const updateById = async(journalId, updateData) => {
    return await journal.findByIdAndUpdate(
        journalId,
        {
            $set: updateData,
        },
        {
            new: true,
            runValidators: true,
        }
     ).lean();
};

// DELETE
export const deleteById = async(journalId) => {
    return await journal.findByIdAndDelete(journalId);
};

// GET UNIQUE TAGS
export const getTags = async(userId) => {
    const tags = await journal.distinct("tags", { createdBy: userId});
    return tags.sort();
};