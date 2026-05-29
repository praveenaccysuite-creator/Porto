"use client";
import { FaCode } from "react-icons/fa";
import { ScrollStackContainer } from "../../utils/ScrollStack";
import { experienceInfo } from "@/services/experience.service";

const ExperienceSection = ({ data }: { data: experienceInfo[] }) => {
  const experiences = data;

  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 mx-auto max-w-7xl relative">
      {/* Section Title */}

      <h1
        className="text-center font-bold mb-8 relative
        text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100 px-4
        "
      >
        Work <span className="text-pink-500">Experience</span>
        <div className="absolute w-20 h-1 bg-pink-500 left-1/2 -translate-x-1/2 bottom-[-12px]"></div>
      </h1>

      <ScrollStackContainer className="mt-10">
        {experiences.map((exp: experienceInfo, index: number) => {
            const Icon = FaCode;

            return (
              <div key={exp.id} className="mb-8">
                <div className=" bg-white dark:bg-gray-800 rounded-bl-3xl rounded-tr-3xl overflow-hidden shadow-xl border border-pink-50 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
                  <div className="absolute bottom-10 right-0 hidden sm:block">
                    <div
                      className="relative bg-pink-600 dark:bg-pink-700 text-white 
    px-6 py-2 font-semibold text-xs sm:text-sm shadow-lg"
                    >
                      Experience
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 
        w-0 h-0 border-t-[12px] border-b-[12px]
        border-t-transparent border-b-transparent
        border-r-[12px] border-r-pink-700 dark:border-r-pink-800
        -translate-x-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg">
                          <Icon className="text-white text-2xl" />
                        </div>

                        {/* Title & Company Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                {exp.title}
                              </h2>
                              <h3
                                className="text-xl md:text-2xl font-semibold mb-3"
                                style={{ color: exp.color }}
                              >
                                {exp.company}
                              </h3>
                            </div>
                            {/* Card Number Badge */}
                            <div className="hidden md:flex w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 items-center justify-center text-white font-bold text-lg shadow-lg">
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              📍 {exp.location}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              📅 {exp.duration}
                            </span>
                            <span>•</span>
                            <span className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full font-medium">
                              {exp.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8">
                      <div className="grid md:grid-cols-1 gap-6">
                        {/* Responsibilities */}
                        <div>
                          <h4
                            className="font-bold text-gray-800 dark:text-gray-200 mb-4"
                            style={{ fontSize: "1.4rem" }}
                          >
                            Key Responsibilities
                          </h4>

                          <ul className="space-y-3">
                            {exp.responsibilities.map(
                              (resp: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                                >
                                  <span className="text-pink-500 text-lg mt-0.5 flex-shrink-0">
                                    •
                                  </span>
                                  <span className="flex-1 leading-relaxed text-md">
                                    {resp}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>

                        {/* Technologies */}
                        <div>
                          <h4 className=" text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-2 bg-gradient-to-br from-pink-50 dark:from-gray-700 to-white dark:to-gray-800 border border-pink-100 dark:border-gray-600 rounded-lg text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-pink-600 dark:text-pink-400 text-sm font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </ScrollStackContainer>
    </div>
  );
};

export default ExperienceSection;
