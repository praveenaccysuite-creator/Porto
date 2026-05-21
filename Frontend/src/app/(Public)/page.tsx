"use client";

import { useEffect, useState } from "react";

import TopPage from "./pages/heroSection";
import About from "./pages/about";
import EducationSection from "./pages/education";
import MinorProject from "./pages/minorProjects";
import MajorProjects from "./pages/majorProject";
import GradientBackground from "../utils/gradientBackground";
import SkillsSection from "./pages/skillsSection";
import ContactSection from "./pages/contact";
import ExperienceSection from "./pages/experience";
import DockClient from "./components/DockClient";
import ScrollSectionClient from "./components/ScrollSectionClient";
import Footer from "./components/Footer";

import { heroService } from "@/services/heroSection.service";
import { aboutService } from "@/services/aboutSection.service";
import { experienceService } from "@/services/experience.service";
import { educationService } from "@/services/education.service";
import { skillsService } from "@/services/skillSection.service";
import {
  majorProjectService,
  minorProjectService,
} from "@/services/projectService";

import type { heroInfo } from "@/services/heroSection.service";
import type { aboutInfo } from "@/services/aboutSection.service";
import type { experienceInfo } from "@/services/experience.service";
import type { educationInfo } from "@/services/education.service";
import type { SkillInfo } from "@/services/skillSection.service";
import type {
  minorProjectInfo,
  MajorProjectInfo,
} from "@/services/projectService";

export default function Home() {
  const [heroData, setHeroData] = useState<heroInfo | null>(null);

  const [aboutData, setAboutData] =
    useState<aboutInfo | null>(null);

  const [experienceData, setExperienceData] =
    useState<experienceInfo[]>([]);

  const [educationData, setEducationData] =
    useState<educationInfo[]>([]);

  const [skillsData, setSkillsData] =
    useState<SkillInfo[]>([]);

  const [majorProjects, setMajorProjects] =
    useState<MajorProjectInfo[]>([]);

  const [minorProjects, setMinorProjects] =
    useState<minorProjectInfo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          about,
          hero,
          experience,
          education,
          skills,
          major,
          minor,
        ] = await Promise.all([
          aboutService.getInfo(),
          heroService.getInfo(),
          experienceService.getInfo(),
          educationService.getInfo(),
          skillsService.getInfo(),
          majorProjectService.getAll(),
          minorProjectService.getAll(),
        ]);

        setAboutData(about);
        setHeroData(hero);
        setExperienceData(experience);
        setEducationData(education);
        setSkillsData(skills);
        setMajorProjects(major);
        setMinorProjects(minor);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <GradientBackground />

      <ScrollSectionClient id="hero">
        <TopPage heroData={heroData} />
      </ScrollSectionClient>

      <ScrollSectionClient id="about">
        <About aboutData={aboutData} />
      </ScrollSectionClient>

      <ScrollSectionClient id="experience">
        <ExperienceSection data={experienceData} />
      </ScrollSectionClient>

      <ScrollSectionClient id="education">
        <EducationSection data={educationData} />
      </ScrollSectionClient>

      <ScrollSectionClient id="skills">
        <SkillsSection data={skillsData} />
      </ScrollSectionClient>

      <ScrollSectionClient id="projects">
        <MinorProject data={minorProjects} />
      </ScrollSectionClient>

      <ScrollSectionClient id="major-projects">
        <MajorProjects data={majorProjects} />
      </ScrollSectionClient>

      <ScrollSectionClient id="contact">
        <ContactSection />
      </ScrollSectionClient>

      <div className="hidden sm:block">
        <DockClient />
      </div>

      <Footer />
    </>
  );
}