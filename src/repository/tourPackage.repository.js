import tourPackage from "../models/tourPackage.model.js";

export const create = async (data) => {
    return await tourPackage.create(data);
}

export const findAll = async({ skip, limit }) => {
    const [data, total] = await Promise.all([
        tourPackage.find()
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)
        .lean(),

        tourPackage.countDocuments(),
    ]);

    return { data, total };
};

export const findById = async (id) => {
    return await tourPackage.findById(id);
};

export const updateById = async (id, updateData) => {
    return await tourPackage.findByIdAndUpdate(id, {$set:updateData}, {new:true, runValidators: true});
};

export const deleteById = async (id) => {
    return await tourPackage.findByIdAndUpdate(id);
}
