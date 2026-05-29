import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiErrors.js";
import { prisma } from "../../../lib/prisma.js";

const createSkillsSection = asyncHandler(async (req, res) => {
  const { name, proficiency, category, icon, color } = req.body;

  const existingSkill = await prisma.skill.findUnique({
    where: { name },
  });

  if (existingSkill) {
    throw new ApiError(400, "Skill already exists");
  }

  const skills = await prisma.skill.create({
    data: {
      name,
      proficiency,
      category,
      icon,
      color,
    },
  });

  return res.status(201).json(new ApiResponse(201, "skills section created", skills));
}); 
 


const getSkillsSection = asyncHandler(async (req, res) => {
  const skills = await prisma.skill.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "skills section retrieved", skills));
});

const deleteSkillsSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.skill.delete({
    where: { id: Number(id) },
  });

  return res.status(200).json(
    new ApiResponse(200, "Skill deleted successfully")
  );
});

export { createSkillsSection, getSkillsSection, deleteSkillsSection };

