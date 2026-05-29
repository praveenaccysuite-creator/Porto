"use client";

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
import type { HomePageData } from "@/lib/fetchHomeData";

export default function HomeClient({ data }: { data: HomePageData }) {
  return (
    <>
      <GradientBackground />

      <ScrollSectionClient id="hero">
        <TopPage heroData={data.hero} />
      </ScrollSectionClient>

      <ScrollSectionClient id="about">
        <About aboutData={data.about} />
      </ScrollSectionClient>

      <ScrollSectionClient id="experience">
        <ExperienceSection data={data.experience} />
      </ScrollSectionClient>

      <ScrollSectionClient id="education">
        <EducationSection data={data.education} />
      </ScrollSectionClient>

      <ScrollSectionClient id="skills">
        <SkillsSection data={data.skills} />
      </ScrollSectionClient>

      <ScrollSectionClient id="projects">
        <MinorProject data={data.minorProjects} />
      </ScrollSectionClient>

      <ScrollSectionClient id="major-projects">
        <MajorProjects data={data.majorProjects} />
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
