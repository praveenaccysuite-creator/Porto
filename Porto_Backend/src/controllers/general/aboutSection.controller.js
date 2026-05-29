import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiErrors.js";
import { prisma } from "../../../lib/prisma.js";
import { deleteFromS3 } from "../../middlewares/upload.js";

const createAbout = asyncHandler(async (req, res) => {
  const { bio, specialization, education } = req.body;

  let existing = await prisma.aboutSection.findUnique({
    where: { id: 1 },
  });

  let imageUrl = existing?.imageUrl || "";

  if (req.files?.aboutImage?.[0]) {
    const imageFile = req.files.aboutImage[0];

    if (existing?.imageUrl) {
      await deleteFromS3(existing.imageUrl);
    }

    imageUrl = imageFile.location;
  }

  let documentObj = existing?.documents || null;

  if (req.files?.document?.[0]) {
    const pdfFile = req.files.document[0];

    if (existing?.documents?.fileUrl) {
      await deleteFromS3(existing.documents.fileUrl);
    }

    documentObj = {
      title: req.body.title || existing?.documents?.title || "",
      fileUrl: pdfFile.location,
    };
  }

  const updated = await prisma.aboutSection.upsert({
    where: { id: 1 },
    update: {
      bio,
      specialization,
      education,
      imageUrl,
      documents: documentObj,
    },
    create: {
      id: 1,
      bio,
      specialization,
      education,
      imageUrl,
      documents: documentObj,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "About section updated", updated));
});

const getAboutSection = asyncHandler(async (req, res) => {
  const about = await prisma.aboutSection.findUnique({
    where: { id: 1 },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "About section retrieved", about ?? null));
});

export { createAbout, getAboutSection };
