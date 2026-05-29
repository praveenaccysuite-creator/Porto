import { cache } from "react";
import { serverGet, serverGetList } from "./server-api";
import type { heroInfo } from "@/services/heroSection.service";
import type { aboutInfo } from "@/services/aboutSection.service";
import type { experienceInfo } from "@/services/experience.service";
import type { educationInfo } from "@/services/education.service";
import type { SkillInfo } from "@/services/skillSection.service";
import type {
  minorProjectInfo,
  MajorProjectInfo,
} from "@/services/projectService";
import type { PortfolioInfo } from "@/types/portfolio";

export interface HomePageData {
  portfolioInfo: PortfolioInfo | null;
  hero: heroInfo | null;
  about: aboutInfo | null;
  experience: experienceInfo[];
  education: educationInfo[];
  skills: SkillInfo[];
  majorProjects: MajorProjectInfo[];
  minorProjects: minorProjectInfo[];
}

async function loadHomePageData(): Promise<HomePageData> {
  const [
    portfolioInfo,
    hero,
    about,
    experience,
    education,
    skills,
    majorProjects,
    minorProjects,
  ] = await Promise.all([
    serverGet<PortfolioInfo>("/info"),
    serverGet<heroInfo>("/hero"),
    serverGet<aboutInfo>("/about"),
    serverGetList<experienceInfo>("/experience"),
    serverGetList<educationInfo>("/education"),
    serverGetList<SkillInfo>("/skills"),
    serverGetList<MajorProjectInfo>("/majorProjects"),
    serverGetList<minorProjectInfo>("/minorProjects"),
  ]);

  return {
    portfolioInfo,
    hero,
    about,
    experience,
    education,
    skills,
    majorProjects,
    minorProjects,
  };
}

/** Deduped per request — safe to call from layout + page. */
export const fetchHomePageData = cache(loadHomePageData);
