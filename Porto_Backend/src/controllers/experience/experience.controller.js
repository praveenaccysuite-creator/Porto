import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiErrors.js";
import { prisma } from "../../../lib/prisma.js";

const createExperience = asyncHandler(async (req, res) => {
  const { title, company, location, duration, period, type, responsibilities, technologies, color } = req.body;

  const experience = await prisma.experience.create({
    data: {
      title,
      company,
      location,
      duration,
      period,
      type,
      responsibilities,
      technologies,
      color,
    },
  });

  return res.status(201).json(new ApiResponse(201, "experience section created", experience));
});

const getExperienceSection = asyncHandler(async (req, res) => {
  const experience = await prisma.experience.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "experience section retrieved", experience));
});

const updateExperienceSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, company, location, duration, period, type, responsibilities, technologies, color } = req.body;

  const experience = await prisma.experience.update({
    where: { id: Number(id) },
    data: {
      title,
      company,
      location,
      duration,
      period,
      type,
      responsibilities,
      technologies,
      color,
    },
  });

  return res.status(200).json(new ApiResponse(200, "experience section updated", experience));
});


const deleteExperienceSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.experience.delete({
    where: { id: Number(id) },
  });

return res.status(200).json(
  new ApiResponse(200, "Experience section deleted successfully")
);
});

export { createExperience, getExperienceSection, updateExperienceSection, deleteExperienceSection };
