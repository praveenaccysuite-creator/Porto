import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiErrors.js";
import { prisma } from "../../../lib/prisma.js";

const createHero = asyncHandler(async (req, res) => {
  const { bio } = req.body;

  const hero = await prisma.heroSection.upsert({
    where: { id: 1 },
    update: {
      bio,
    },
    create: {
      id: 1,
      bio,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Hero section created vesion 3.0", hero));
});


const getHeroSection = asyncHandler(async (req, res) => {
  const hero = await prisma.heroSection.findUnique({
    where: { id: 1 },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Hero section retrieved", hero ?? null));
});

export { createHero, getHeroSection };
