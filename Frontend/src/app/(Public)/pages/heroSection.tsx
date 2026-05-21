"use client";

import React, { useRef } from "react";
import Header from "../components/Header";
import {
  AiOutlineClose,
  AiFillLinkedin,
  AiFillGithub,
  AiOutlineJavaScript,
} from "react-icons/ai";
import Image from "next/image";
import { motion, useSpring } from "framer-motion";

import { heroInfo } from "@/services/heroSection.service";

interface TopPageProps {
  heroData: heroInfo | null;
  // portfolioInfo: PortfolioInfo;
}


const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const TopPage = ({ heroData }: TopPageProps) => {
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
  const bioContent = heroData;

  const imageCardRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { damping: 30, stiffness: 100, mass: 2 });
  const rotateY = useSpring(0, { damping: 30, stiffness: 100, mass: 2 });
  const scale = useSpring(1, { damping: 30, stiffness: 100, mass: 2 });

  const handleImageCardMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageCardRef.current) return;

    const rect = imageCardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -22;
    const rotationY = (offsetX / (rect.width / 2)) * 22;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  };

  const handleImageCardEnter = () => {
    scale.set(1.05);
  };

  const handleImageCardLeave = () => {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <>
      <Header />
      <div className="mt-12 p-0 md:p-12">
        <div className="relative isolate px-4 sm:px-5 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mx-auto max-w-7xl">
            <div className="w-full lg:w-8/12">
              <motion.div {...fadeUp(0.1)} className="flex justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm text-gray-700 dark:text-gray-100 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  Connect me on LinkedIn.{" "}
                  <a
                    target="_blank"
                    href={info?.socialLinks?.linkedin}
                    className="font-semibold text-indigo-600"
                  >
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    Read more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </motion.div>

              <div className="py-6 text-center ">
                {/* 2️⃣ H1 NAME */}
                <motion.h1
                  {...fadeUp(0.25)}
                  className="text-balance text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl"
                >
                  Hi, I'm Praveen Singh!
                </motion.h1>

                <motion.div
                  {...fadeUp(0.4)}
                  className="mt-2 md:ml-12 block md:flex centjustifyer"
                >
                  <h1 className="hidden sm:block text-balance text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl fontX-large">
                    Experience In
                  </h1>

                  <div className="content__container mt-2 md:mt-0 ">
                    <ul className="content__container__list ">
                      <li className="content__container__list__item text-4xl font-semibold text-gray-900 dark:text-gray-100 sm:text-6xl text-center sm:text-left">
                        Frontend Dev
                      </li>
                      <li className="content__container__list__item text-4xl font-semibold text-gray-900 dark:text-gray-100 sm:text-6xl text-center sm:text-left">
                        Backend Dev
                      </li>
                      <li className="content__container__list__item text-4xl font-semibold text-gray-900 dark:text-gray-100 sm:text-6xl text-center sm:text-left">
                        MERN-Stack
                      </li>
                      <li className="content__container__list__item text-4xl font-semibold text-gray-900 dark:text-gray-100 sm:text-6xl text-center sm:text-left">
                        Full-Stack AI
                      </li>
                    </ul>
                  </div>
                </motion.div>

                {/* 4️⃣ PARAGRAPH */}
                <motion.p
                  {...fadeUp(0.55)}
                  className="mt-8 text-pretty text-lg font-medium text-gray-500 dark:text-gray-100 sm:text-xl/8"
                >
                  {bioContent?.bio || "No bio available"}
                </motion.p>

                {/* 5️⃣ BUTTONS */}
                <motion.div
                  {...fadeUp(0.5)}
                  className="mt-10 flex items-center justify-center gap-x-6"
                >
                  <a
                    target="_blank"
                    href={`mailto:${info?.email}`}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Hire Me
                  </a>
                  <a
                    href="#about"
                    className="text-sm/6 font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Scroll for more <span aria-hidden="true">→</span>
                  </a>
                </motion.div>
              </div>
            </div>

            {/* 6️⃣ 3D TILTED IMAGE SECTION */}
            <motion.div {...fadeUp(0.3)} className="w-4/12 max-lg:hidden">
              <div
                ref={imageCardRef}
                className="hero-image-card-container"
                style={{ perspective: "1000px" }}
                onMouseMove={handleImageCardMouse}
                onMouseEnter={handleImageCardEnter}
                onMouseLeave={handleImageCardLeave}
              >
                <motion.div
                  className="hero-image-card"
                  style={{
                    rotateX,
                    rotateY,
                    scale,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Main Image */}
                  <div className="hero-image-wrapper border border-red-500 dark:border-gray-100">
                    {typeof info?.profileImage === "string" && (
                      <Image
                        src={info.profileImage}
                        alt="Avatar"
                        width={350}
                        height={350}
                        priority
                      />
                    )}
                    {/* Floating Tech Icons */}
                    <span className="circle circle2"></span>
                    <span className="circle circle3"></span>
                    <span className="circle circle4"></span>
                    <span
                      className="circle circle5"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <AiOutlineJavaScript />
                    </span>
                  </div>

                  {/* Card Content Overlay */}
                  <div className="hero-card-content">
                    <div className="hero-content-inner">
                      <span className="hero-title">Connect with me</span>
                      {/* Social Buttons */}
                      <div className="hero-social-buttons">
                        <a
                          target="_blank"
                          href={info?.socialLinks?.twitter}
                          aria-label="Open Twitter profile"
                          className="hero-social-btn inline-flex items-center justify-center"
                        >
                          <AiOutlineClose />
                        </a>

                        <a
                          target="_blank"
                          href={info?.socialLinks?.linkedin}
                          aria-label="Open LinkedIn profile"
                          className="hero-social-btn linkedin inline-flex items-center justify-center"
                        >
                          <AiFillLinkedin className="text-sky-600" />
                        </a>

                        <a
                          target="_blank"
                          href={info?.socialLinks?.github}
                          aria-label="Open GitHub profile"
                          className="hero-social-btn github inline-flex items-center justify-center"
                        >
                          <AiFillGithub />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 3D Depth Effect */}
                  <div className="hero-card-depth"></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopPage;
