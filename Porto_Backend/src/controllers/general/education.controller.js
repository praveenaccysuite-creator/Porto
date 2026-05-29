import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiErrors.js";
import { prisma } from "../../../lib/prisma.js";
import { deleteFromS3 } from "../../middlewares/upload.js";

const createEducation = asyncHandler(async (req, res) => {
  const { link, collageName, course, duration, subjects } = req.body;

  if (!req.file) {
    throw new ApiError(400, "College image is required");
  }

  const education = await prisma.educationCard.create({
    data: {
      link,
      collageImage: req.file.location,
      collageName,
      course,
      duration,
      subjects: JSON.parse(subjects),
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Education created", education));
});

const getEducationSection = asyncHandler(async (req, res) => {
  const education = await prisma.educationCard.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "education section retrieved", education));
});

const updateEducationSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { link, collageName, course, duration, subjects } = req.body;

  const existing = await prisma.educationCard.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) {
    throw new ApiError(404, "Education not found");
  }

  let collageImage = existing.collageImage;

  if (req.file) {
    // delete old image from S3
    if (existing.collageImage) {
      await deleteFromS3(existing.collageImage);
    }

    collageImage = req.file.location;
  }

  const education = await prisma.educationCard.update({
    where: { id: Number(id) },
    data: {
      link,
      collageImage,
      collageName,
      course,
      duration,
      subjects: subjects ? JSON.parse(subjects) : existing.subjects,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Education updated", education));
});

const deleteEducationSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.educationCard.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) {
    throw new ApiError(404, "Education not found");
  }

  // delete image from S3
  if (existing.collageImage) {
    await deleteFromS3(existing.collageImage);
  }

  await prisma.educationCard.delete({
    where: { id: Number(id) },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Education section deleted successfully"));
});

export {
  createEducation,
  getEducationSection,
  updateEducationSection,
  deleteEducationSection,
};
