"use client";
import { useState, useEffect } from "react";
import GlassCard from "../components/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Tag,
} from "lucide-react";
import {
  experienceService,
  experienceInfo,
  ExperiencePayload,
} from "@/services/experience.service";
import { useToast } from "@/app/context/ToastContext";
import { useAuth } from "@/app/context/AuthContext";

import { useConfirmModal } from "../components/useConfirmModal";
import ConfirmModal from "../components/ConfirmModal";
import FormInput from "../components/FormInput";
import MultiSelectInput from "../components/MultiSelectInput";
import Loader from "@/app/Loader";
import SectionEmptyState from "@/app/(Public)/components/ui/SectionEmptyState";

const experienceTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];
const experienceColors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
];

export default function ExperiencePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { modalState, openConfirm, closeConfirm } = useConfirmModal();

  const [experiences, setExperiences] = useState<experienceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<experienceInfo>>({
    title: "",
    company: "",
    location: "",
    duration: "",
    period: "",
    type: "Full-time",
    responsibilities: [""],
    technologies: [""],
    color: "#3b82f6",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      duration: "",
      period: "",
      type: "Full-time",
      responsibilities: [""],
      technologies: [""],
      color: "#3b82f6",
    });
  };

  const buildPayload = (): ExperiencePayload => ({
    title: formData.title || "",
    company: formData.company || "",
    location: formData.location || "",
    duration: formData.duration || "",
    period: formData.period || "",
    type: formData.type || "Full-time",
    responsibilities: formData.responsibilities?.filter(Boolean) || [],
    technologies: formData.technologies?.filter(Boolean) || [],
    color: formData.color || "#3b82f6",
  });

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await experienceService.getInfo();
        setExperiences(data);
      } catch (error) {
        showToast({
          message: "Failed to load experience data",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchExperience();
  }, []);

  const handleCreate = async () => {
    try {
      const payload = buildPayload();
      const created = await experienceService.createInfo(payload);
      setExperiences((prev) => [...prev, created]);
      setIsCreating(false);
      showToast({
        message: "Experience added successfully",
        type: "success",
      });
      resetForm();
    } catch (error) {
      showToast({
        message: "Failed to add experience",
        type: "error",
      });
    }
  };

  const handleUpdate = async () => {
    if (!isEditing) return;
    try {
      const payload = buildPayload();
      const updated = await experienceService.updateInfo(isEditing, payload);
      setExperiences((prev) =>
        prev.map((exp) => (exp.id === isEditing ? updated : exp)),
      );
      setIsEditing(null);
      resetForm();
      showToast({
        message: "Experience updated successfully",
        type: "success",
      });
    } catch (error) {
      showToast({
        message: "Failed to update experience",
        type: "error",
      });
    }
  };

  const handleDelete = (id: number, experienceName: string) => {
    openConfirm({
      title: "Delete Experience",
      message: `Are you sure you want to delete "${experienceName}"? This action cannot be undone.`,
      variant: "danger",
      onConfirm: async () => {
        const snapshot = experiences;

        // Optimistic update
        setExperiences((prev) => prev.filter((exp) => exp.id !== id));
        setDeleteLoading(true);

        try {
          await experienceService.deleteInfo(id);
          showToast({
            message: "Experience deleted successfully",
            type: "success",
          });
          closeConfirm(); // Close modal on success
        } catch (error) {
          // Revert on error
          setExperiences(snapshot);
          showToast({
            message: "Failed to delete experience",
            type: "error",
          });
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

  const startEdit = (exp: experienceInfo) => {
    setIsEditing(exp.id);
    setFormData({
      ...exp,
      responsibilities: [...exp.responsibilities, ""],
      technologies: [...exp.technologies, ""],
    });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setIsCreating(false);
    resetForm();
  };

  const addResponsibility = () => {
    setFormData({
      ...formData,
      responsibilities: [...(formData.responsibilities || []), ""],
    });
  };

  const removeResponsibility = (index: number) => {
    setFormData({
      ...formData,
      responsibilities:
        formData.responsibilities?.filter((_, i) => i !== index) || [],
    });
  };

  const updateResponsibility = (index: number, value: string) => {
    const updated = [...(formData.responsibilities || [])];
    updated[index] = value;
    setFormData({ ...formData, responsibilities: updated });
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard>
        <div className="sm:flex block justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Experience Timeline
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Track your professional journey with an interactive timeline
            </p>
          </div>
          {user?.role === "ADMIN" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all mt-4 sm:mt-0"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </motion.button>
          )}
        </div>
      </GlassCard>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {(isCreating || isEditing) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {isCreating ? "Add New Experience" : "Edit Experience"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Job Title"
                    value={formData.title || ""}
                    onChange={(value) =>
                      setFormData({ ...formData, title: value })
                    }
                    placeholder="e.g., Senior Full-Stack Developer"
                    required
                  />

                  <FormInput
                    label="Company"
                    value={formData.company || ""}
                    onChange={(value) =>
                      setFormData({ ...formData, company: value })
                    }
                    placeholder="e.g., Tech Innovations Pvt Ltd"
                    required
                  />

                  <FormInput
                    label="Location"
                    value={formData.location || ""}
                    onChange={(value) =>
                      setFormData({ ...formData, location: value })
                    }
                    placeholder="e.g., Bangalore, India"
                  />

                  <FormInput
                    label="Duration"
                    value={formData.duration || ""}
                    onChange={(value) =>
                      setFormData({ ...formData, duration: value })
                    }
                    placeholder="e.g., 2 years"
                  />

                  <FormInput
                    label="Period"
                    value={formData.period || ""}
                    onChange={(value) =>
                      setFormData({ ...formData, period: value })
                    }
                    placeholder="e.g., Jan 2024 - Present"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Employment Type
                    </label>
                    <select
                      value={formData.type || "Full-time"}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      {experienceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ✅ Color Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Color Theme
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {experienceColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-full transition-all ${
                          formData.color === color
                            ? "ring-4 ring-offset-2 ring-gray-400 dark:ring-gray-600 scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* ✅ SINGLE MultiSelectInput for Responsibilities */}
                <MultiSelectInput
                  label="Responsibilities"
                  items={formData.responsibilities?.filter(Boolean) || []}
                  onChange={(items) =>
                    setFormData({ ...formData, responsibilities: items })
                  }
                  placeholder="e.g., Built scalable React applications"
                  emptyMessage="Add your key responsibilities"
                />

                {/* ✅ SINGLE MultiSelectInput for Technologies */}
                <MultiSelectInput
                  label="Technologies"
                  items={formData.technologies?.filter(Boolean) || []}
                  onChange={(items) =>
                    setFormData({ ...formData, technologies: items })
                  }
                  placeholder="e.g., React, Node.js, AWS"
                  emptyMessage="Add technologies you worked with"
                />

                <div className="flex gap-2 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={isCreating ? handleCreate : handleUpdate}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    <Save className="w-4 h-4" />
                    {isCreating ? "Save Experience" : "Update Experience"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={closeConfirm}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        variant={modalState.variant}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
      />

      {/* Timeline */}
      {experiences.length > 0 ? (
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />

          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="relative pl-16 md:pl-20"
              >
                {/* Timeline dot with pulse animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                  className="absolute left-3 md:left-5 top-8 w-7 h-7 rounded-full border-4 border-white dark:border-slate-900 shadow-lg z-10"
                  style={{ backgroundColor: experience.color }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: experience.color }}
                  />
                </motion.div>

                <GlassCard hover={true}>
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                          style={{ backgroundColor: experience.color }}
                        >
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {experience.title}
                          </h3>
                          <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {experience.company}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${experience.color}20`,
                          color: experience.color,
                        }}
                      >
                        {experience.type}
                      </span>
                      {user?.role === "ADMIN" && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEdit(experience)}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleDelete(experience.id, experience.title)
                            }
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{experience.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{experience.period}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{experience.duration}</span>
                    </div>
                  </div>

                  {experience.responsibilities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <div
                          className="w-1 h-4 rounded-full"
                          style={{ backgroundColor: experience.color }}
                        />
                        Key Responsibilities:
                      </h4>
                      <ul className="space-y-1.5 text-gray-700 dark:text-gray-300 text-sm ml-5">
                        {experience.responsibilities.map(
                          (responsibility, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span
                                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: experience.color }}
                              />
                              <span>{responsibility}</span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {experience.technologies.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Technologies Used:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, idx) => (
                          <motion.span
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + idx * 0.05 }}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium hover:scale-105 transition-transform cursor-default"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      ) : isLoading ? (
        <Loader />
      ) : (
        <SectionEmptyState
          title="Experience section"
          message="No work experience has been added yet."
        />
      )}
    </div>
  );
}
