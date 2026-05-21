"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiPrisma,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiNginx,
  SiGithubactions,
  SiLinux,
  SiOpenai,
  SiPython,
} from "react-icons/si";
import LogoLoop from "../components/LogoLoop";

import { aboutInfo } from "@/services/aboutSection.service";
import { PortfolioInfo } from "@/types/portfolio";


interface aboutProps {
  aboutData: aboutInfo | null;
  // portfolioInfo: PortfolioInfo;
}

import { PDFModal } from "../components/ui/PDFModal";

export const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiTailwindcss />,
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiExpress />, title: "Express.js", href: "https://expressjs.com" },
  { node: <SiPrisma />, title: "Prisma ORM", href: "https://www.prisma.io" },
  {
    node: <SiPostgresql />,
    title: "PostgreSQL",
    href: "https://www.postgresql.org",
  },
  { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com" },
  { node: <SiRedis />, title: "Redis", href: "https://redis.io" },
  { node: <SiDocker />, title: "Docker", href: "https://www.docker.com" },
  { node: <SiNginx />, title: "Nginx", href: "https://nginx.org" },
  {
    node: <SiGithubactions />,
    title: "GitHub Actions",
    href: "https://github.com/features/actions",
  },
  { node: <SiLinux />, title: "Linux", href: "https://www.linux.org" },
  {
    node: <SiOpenai />,
    title: "OpenAI API",
    href: "https://platform.openai.com",
    category: "AI",
  },
  {
    node: <SiPython />,
    title: "Python",
    href: "https://www.python.org",
    category: "AI",
  },
];

const About = ({ aboutData } : aboutProps) => {

const info = {
  email: "john.doe@example.com",
  phone: "+1234567890",
  location: "New York, USA",
  profileImage: "/images/profile.jpg",
  socialLinks: {
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe",
    instagram: "https://instagram.com/johndoe",
  },
};

const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState({ url: "", title: "" });

const myBio = aboutData;

  const openPDFModal = (url: string, title: string) => {
    setSelectedPDF({ url, title });
    setIsModalOpen(true);
  };

  return (
    <motion.div
      className="mt-16 mx-auto px-4 py-16 max-w-7xl relative overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {isModalOpen && (
        <PDFModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pdfUrl={selectedPDF.url}
          title={selectedPDF.title}
        />
      )}

      {/* Title */}
      <motion.h1
        className="text-center font-bold mb-8 relative
        text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100 px-4
        "
      >
        About <span className="text-pink-500">Me</span>
        <div className="absolute w-20 h-1 bg-pink-500 left-1/2 -translate-x-1/2 bottom-[-12px]"></div>
      </motion.h1>

      {/* Main card */}
      <motion.div className="relative rounded-3xl backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-pink-100 dark:border-gray-700 shadow-xl p-4 mb-16">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Profile Image */}
          <motion.div
            transition={{ duration: 0.6 }}
            className="relative sm:w-64 w-full h-64 rounded-xl overflow-hidden border-4 border-transparent bg-gradient-to-br from-pink-400 to-pink-600 p-1"
          >
              <Image
                src={"/assets/img/about.webp"}
                alt="Praveen Singh"
                layout="fill"
                objectFit="cover"
              />
          </motion.div>

          <motion.div className="flex-1">
            <motion.h2 className="text-3xl font-bold mb-3">
              <span className="text-pink-500">Praveen Singh</span>
              <span className="text-gray-700 dark:text-gray-100">
                {" "}
                / {myBio?.specialization || "Full Stack AI Developer"}
              </span>
            </motion.h2>

            <motion.p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
              {myBio?.bio || "No bio available"}
            </motion.p>

          {/* <GradientBackground/> */}

            {/* Skills */}
            <motion.div className="flex flex-wrap gap-2 mb-6">
              {[
                "React",
                "Node.js",
                "MongoDB",
                "Express",
                "Next.js",
                "Tailwind CSS",
                "API Integration",
                "Payment Gateways",
              ].map((skill) => (
                <motion.span
                  key={skill}
                  className="px-3 py-1 bg-pink-50 text-pink-600 border border-pink-200 rounded-full text-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
            

            {/* Button */}
            <motion.a
              href={`mailto:${info?.email}`}
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-pink-200 transition-all duration-300"
            >
              Get In Touch
            </motion.a>
          </motion.div>
        </div>

        {/* Logo Loop */}
        <motion.div className="mt-12" transition={{ delay: 0.5 }}>
          <LogoLoop
            logos={techLogos}
            speed={120}
            direction="left"
            logoHeight={30}
            gap={40}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
          />
        </motion.div>
      </motion.div>

      {/* Info Cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
        {[
          { title: "Full Name", value: "Praveen Singh" },
          { title: "Specialization", value: `${myBio?.specialization}` },
          { title: "Email", value: info?.email || "undefined" },
          { title: "Education", value: `${myBio?.education}` },
        ].map((item) => (
          <motion.div
            key={item.title}
            className="bg-white dark:bg-gray-800 border border-pink-100 dark:border-gray-700 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="text-pink-500 dark:text-pink-400 font-medium mb-2">
              {item.title}
            </h3>
            <p className="text-gray-800 dark:text-gray-200 font-semibold">
              {item.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Documents */}
      <motion.div className="bg-white dark:bg-gray-800 border border-pink-100 dark:border-gray-700 rounded-3xl p-4 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Documents
        </h3>

        {myBio?.documents && myBio?.documents.fileUrl ? (
          <motion.div
            className="flex items-center justify-between p-4 border border-pink-100 rounded-lg transition-colors mb-4"
            whileHover={{ borderColor: "#ec4899" }}
          >
            <span className="font-medium text-gray-700 dark:text-gray-100 truncate">
              {myBio.documents.title}
            </span>

            <motion.button
              onClick={() =>
                openPDFModal(
                  myBio.documents.fileUrl || "",
                  myBio.documents.title,
                )
              }
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors relative overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 0px rgba(236, 72, 153, 0.4)",
                  "0 0 20px rgba(236, 72, 153, 0.6), 0 0 30px rgba(236, 72, 153, 0.4)",
                  "0 0 0px rgba(236, 72, 153, 0.4)",
                ],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
             Click to View
            </motion.button>
          </motion.div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No documents available
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default About;
