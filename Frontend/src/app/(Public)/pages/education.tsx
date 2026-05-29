"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { educationInfo } from "@/services/education.service";
import RemoteImage from "../components/ui/RemoteImage";

const EducationSection = ({ data }: { data: educationInfo[] }) => {
  const educationList = data;
  const [selectedCard, setSelectedCard] = useState<educationInfo | null>(null);

  useEffect(() => {
    if (educationList.length > 0) {
      setSelectedCard((current) => {
        if (current && educationList.some((item) => item.id === current.id)) {
          return current;
        }
        return educationList[0];
      });
    } else {
      setSelectedCard(null);
    }
  }, [educationList]);

  if (educationList.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 mx-auto px-4 sm:px-0 m-4 max-w-7xl relative pb-10">
      <div className="absolute top-32 left-16 -z-10 opacity-10">
        <div className="w-60 h-60 rounded-full bg-pink-400 blur-3xl" />
      </div>
      <div className="absolute right-16 -z-10 opacity-10">
        <div className="w-56 h-56 rounded-full bg-pink-600 blur-3xl" />
      </div>

      <h1 className="text-center font-bold mb-8 relative text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-gray-900 dark:text-gray-100 px-4">
        Education <span className="text-pink-500">Journey</span>
        <div className="absolute w-20 h-1 bg-pink-500 left-1/2 -translate-x-1/2 bottom-[-12px]" />
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
            {educationList.map((card) => (
              <motion.button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCard?.id === card.id
                    ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-pink-100 dark:border-gray-700"
                }`}
              >
                {selectedCard?.id === card.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-pink-500/20"
                    layoutId="activeTab"
                  />
                )}
                <span className="relative z-10">{card.collageName}</span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedCard && (
              <motion.div
                key={selectedCard.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
                className="max-w-5xl mx-auto"
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-pink-50 dark:border-gray-700">
                  <div className="flex flex-col lg:flex-row">
                    <motion.div
                      className="lg:w-2/5 relative"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                    >
                      <div className="h-56 md:h-64 lg:h-full relative min-h-[14rem]">
                        <RemoteImage
                          src={selectedCard.collageImage}
                          alt={selectedCard.collageName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="lg:w-3/5 p-6 md:p-8"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.12 }}
                    >
                      <span className="text-sm text-pink-500 font-semibold">
                        {selectedCard.duration}
                      </span>

                      <h2 className="text-2xl font-bold mt-2 text-gray-800 dark:text-gray-200">
                        {selectedCard.course}
                      </h2>

                      <h3 className="mt-6 mb-3 font-semibold text-gray-600 dark:text-gray-400">
                        Key Subjects
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedCard.subjects.map((subject, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25, delay: index * 0.04 }}
                            className="bg-pink-50 dark:bg-gray-700 rounded-xl p-3 text-center text-sm"
                          >
                            {subject.name}
                          </motion.div>
                        ))}
                      </div>

                      <a
                        href={selectedCard.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-8 px-6 py-2 rounded-full bg-pink-500 text-white font-semibold"
                      >
                        Visit Official Website
                      </a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
    </div>
  );
};

export default EducationSection;
