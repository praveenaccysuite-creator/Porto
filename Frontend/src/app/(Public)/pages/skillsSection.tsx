"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillHtml5, AiFillGithub, AiFillApi } from "react-icons/ai";
import { BiLogoTailwindCss, BiLogoNodejs } from "react-icons/bi";
import { BsFiletypeCss, BsBootstrap } from "react-icons/bs";
import { SkillInfo } from "@/services/skillSection.service";

import {
  FaReact,
  FaPython,
  FaDocker,
  FaAws,
  FaGitAlt,
  FaLinux,
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiTypescript,
  SiExpress,
  SiGraphql,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiFirebase,
  SiJenkins,
  SiGithubactions,
  SiNginx,
  SiWebrtc,
  SiSocketdotio,
  SiWebpack,
  SiVite,
  SiPostman,
  SiPrisma,
} from "react-icons/si";

const iconMap: { [key: string]: React.ComponentType<any> } = {
  FaReact,
  SiNextdotjs,
  SiTypescript,
  AiFillHtml5,
  BsFiletypeCss,
  BiLogoTailwindCss,
  BsBootstrap,
  BiLogoNodejs,
  SiExpress,
  FaPython,
  AiFillApi,
  SiGraphql,
  SiPrisma,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiFirebase,
  FaDocker,
  FaAws,
  SiJenkins,
  SiGithubactions,
  SiNginx,
  FaLinux,
  FaGitAlt,
  AiFillGithub,
  SiWebrtc,
  SiSocketdotio,
  SiWebpack,
  SiVite,
  SiPostman,
};

const SkillsSection = ({ data }: { data: SkillInfo[] }) => {
  const skills = data;

  const categories = Array.from(
    new Set(skills.map((skill) => skill.category).filter(Boolean)),
  ) as string[];

  const [filter, setFilter] = useState(categories[0] ?? "BACKEND");

  const filteredSkills = skills.filter((skill) => skill.category === filter);

  if (skills.length === 0) {
    return null;
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const iconVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.15,
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const badgeVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };


  const SkillIcon = ({ skill }: { skill: SkillInfo }) => {
    const IconComponent = skill.icon ? iconMap[skill.icon] : null;

    if (skill.icon) {
      if (IconComponent) {
        return (
          <IconComponent
            className="text-2xl md:text-3xl lg:text-4xl"
            style={{ color: skill.color }}
          />
        );
      }
    }
    return (
      <span
        className="text-2xl md:text-3xl lg:text-4xl font-semibold"
        style={{ color: skill.color }}
      >
        {skill.name?.charAt(0)}
      </span>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 md:py-16 lg:py-14">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-12 lg:mb-16 space-y-3 md:space-y-4"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-pink-50 dark:bg-pink-900/30 rounded-full border border-pink-100 dark:border-pink-800">
            <span className="text-pink-600 dark:text-pink-400 font-semibold text-xs md:text-sm tracking-wide">
              EXPERTISE
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100 px-4">
            My{" "}
            <span className="bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
              Skills
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base md:text-lg px-4">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        {/* Filter Tabs - Compact scrollable for mobile */}
        <motion.div
          className="flex justify-center mb-8 md:mb-12 pb-2 w-full overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="inline-flex gap-2 p-1.5 md:p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide -webkit-overflow-scrolling-touch">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`relative px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
                  filter === category
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                {category}
                {filter === category && (
                  <motion.span
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg md:rounded-xl shadow-lg shadow-pink-200 -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <div
            key={filter}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6"
          >
            {filteredSkills?.map((skill, index) => {
              return (
                <div
                  key={skill.id}
                  className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0"
                    variants={{
                      rest: { opacity: 0 },
                      hover: { opacity: 1, transition: { duration: 0.3 } },
                    }}
                  />

                  {/* Icon with smooth scale animation - Smaller on mobile */}
                  <div className="relative mb-2 md:mb-3 lg:mb-4">
                    <motion.div
                      className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: `${skill.color}15`,
                        borderColor: `${skill.color}30`,
                        borderWidth: "2px",
                      }}
                      variants={iconVariants}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.6 + index * 0.05,
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
                        <SkillIcon skill={skill} />
                      </motion.div>
                    </motion.div>

                    {/* Category badge - Hidden on mobile, visible on md+ */}
                    <motion.span
                      className="hidden md:block absolute -top-2 -right-2 px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs font-semibold rounded-full"
                      variants={badgeVariants}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.2 + index * 0.05,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      {skill.category}
                    </motion.span>
                  </div>

                  {/* Skill name - Smaller text on mobile */}
                  <motion.h3
                    className="text-sm md:text-base lg:text-xl font-bold text-gray-700 dark:text-gray-100 mb-2 md:mb-3 relative z-10 leading-tight"
                    variants={{
                      hover: {
                        color: "#ec4899",
                        x: 5,
                        transition: { duration: 0.3 },
                      },
                    }}
                  >
                    {skill.name}
                  </motion.h3>

                  <div className="space-y-1 md:space-y-2 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Proficiency
                      </span>
                      <span className="text-xs md:text-sm font-bold text-pink-600">
                        {skill.proficiency}%
                      </span>
                    </div>

                    {/* Progress bar container */}
                    <div className="w-full h-1.5 md:h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full relative"
                        style={{
                          background: `linear-gradient(90deg, ${skill.color} 0%, ${skill.color}dd 100%)`,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency}%` }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ["-100%", "200%"],
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Border glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-xl md:rounded-2xl"
                    variants={{
                      rest: {
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      },
                      hover: {
                        boxShadow:
                          "0 20px 25px -5px rgba(236, 72, 153, 0.3), 0 10px 10px -5px rgba(236, 72, 153, 0.1)",
                        transition: { duration: 0.3 },
                      },
                    }}
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              );
            })}
          </div>
        </AnimatePresence>

        <div className="mt-12 md:mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          {[
            { label: "Total Skills", value: skills?.length, icon: "🚀" },
            {
              label: "Frontend",
              value: skills?.filter((s) => s.category === "FRONTEND").length,
              icon: "💻",
            },
            {
              label: "Backend",
              value: skills?.filter((s) => s.category === "BACKEND").length,
              icon: "⚙️",
            },
            {
              label: "Database",
              value: skills?.filter((s) => s.category === "DATABASE").length,
              icon: "💾",
            },
            {
              label: "DevOps",
              value: skills?.filter((s) => s.category === "DEVOPS").length,
              icon: "🔧",
            },
            {
              label: "Others",
              value: skills?.filter((s) => s.category === "OTHERS").length,
              icon: "⭐",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="text-2xl md:text-3xl lg:text-4xl mb-1 md:mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-0.5 md:mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
