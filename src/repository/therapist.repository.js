import Therapist from "../models/therapist.model.js";

export const create = async (data) => {
    return await Therapist.create(data);
};

export const findAll = async ({ filters,skilimitsortOption = {createdAt: -1},}) => {
  const [data, total] =
    await Promise.all([
      Therapist.find(filters)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),

      Therapist.countDocuments(
        filters
      ),
    ]);

  return {data,total};
};

export const findById = async (
  therapistId
) => {
  return await Therapist.findById(
    therapistId
  ).lean();
};

export const updateById = async (
  therapistId,
  updateData
) => {
  return await Therapist.findByIdAndUpdate(
    therapistId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();
};

export const suspendById =
  async (therapistId) => {
    return await Therapist.findByIdAndUpdate(
      therapistId,
      {
        $set: {
          status: "SUSPENDED",
        },
      },
      {
        new: true,
      }
    );
  };

export const getDistinctSpecialties =
  async () => {
    return await Therapist.distinct(
      "specialties",
      {
        status: "ACTIVE",
      }
    );
  };

  export const getDistinctLanguages =
  async () => {
    return await Therapist.distinct(
      "languages",
      {
        status: "ACTIVE",
      }
    );
  };