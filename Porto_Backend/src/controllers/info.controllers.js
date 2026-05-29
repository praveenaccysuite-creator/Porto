import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { prisma } from "../../lib/prisma.js";
import { deleteFromS3 } from "../middlewares/upload.js";

import redis from "../../lib/redis.js";

export const createOrUpdateInfo = asyncHandler(async (req, res) => {
  const { email, phone, location, socialLinks } = req.body;

  const existingInfo = await prisma.portfolioInfo.findUnique({
    where: { id: 1 },
  });

  let profileImageUrl = existingInfo?.profileImage || "";

  if (req.file) {

    if (existingInfo?.profileImage) {
      await deleteFromS3(existingInfo.profileImage);
    }

    profileImageUrl = req.file.location;
  }

  const info = await prisma.portfolioInfo.upsert({
    where: { id: 1 },
    update: {
      email,
      phone,
      location,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : undefined,
      profileImage: profileImageUrl,
    },
    create: {
      id: 1,
      email,
      phone,
      location,
      socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
      profileImage: profileImageUrl,
    },
  });

  await redis.del("portfolio:info");

  return res
    .status(200)
    .json(new ApiResponse(200, "Portfolio info saved successfully", info));
});

export const getInfo = asyncHandler(async (req, res) => {
  const cacheKey = "portfolio:info";

  const cached = await redis.get(cacheKey);
  if (cached) {
    const info = JSON.parse(cached);
    return res
      .status(200)
      .json(new ApiResponse(200, "Portfolio info retrieved (Redis)", info));
  }

  const info = await prisma.portfolioInfo.findUnique({
    where: { id: 1 },
  });

  if (info) {
    await redis.set(cacheKey, JSON.stringify(info), "EX", 300); // TTL = 5 mins
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Portfolio info retrieved (DB)", info ?? null));
});
