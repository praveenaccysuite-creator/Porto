"use client";
import { AuthUser } from "@/types/auth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Edit, X } from "lucide-react";
import { AiFillLinkedin, AiFillGithub, AiFillInstagram } from "react-icons/ai";

interface PortfolioPageProps {
  user: AuthUser;
}

import GlassCard from "../components/GlassCard";
import FormInput from "../components/FormInput";
import ImageUpload from "../components/ImageUpload";
import { useToast } from "@/app/context/ToastContext";
import { portfolioInfoService } from "@/services/portfolio.service";
import RemoteImage from "@/app/(Public)/components/ui/RemoteImage";
import { PortfolioInfo } from "@/types/portfolio";

export default function PortfolioInfoPage({ user }: PortfolioPageProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<PortfolioInfo>({
    email: "",
    phone: "",
    location: "",
    profileImage: "",
    socialLinks: {},
  });

  const [snapshot, setSnapshot] = useState<PortfolioInfo | null>(null);

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const data = await portfolioInfoService.getInfo();
        if (!data) return;

        setFormData({
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          profileImage: data.profileImage || "",
          socialLinks: data.socialLinks || {},
        });
      } catch {
        showToast({
          message: "Could not load portfolio info",
          type: "error",
        });
      }
    };
    loadInfo();
  }, [showToast]);

  // 🔹 Save
  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await portfolioInfoService.save(formData);
      setFormData({
        email: updated.email || "",
        phone: updated.phone || "",
        location: updated.location || "",
        profileImage: updated.profileImage || "",
        socialLinks: updated.socialLinks || {},
      });
      setIsEditing(false);
      setSnapshot(null);

      showToast({
        message: "Portfolio info updated",
        type: "success",
      });
    } catch (err: any) {
      showToast({
        message: err.message || "Update failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cancel edit
  const handleCancel = () => {
    if (snapshot) setFormData(snapshot);
    setIsEditing(false);
    setSnapshot(null);
  };

  // 🔹 Start edit
  const startEdit = () => {
    setSnapshot(structuredClone(formData));
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      {!isEditing && (
        <GlassCard>
          <div className="flex flex-col md:flex-row gap-6">
            {/* IMAGE SECTION */}
            {typeof formData.profileImage === "string" &&
              formData.profileImage && (
                <div className="w-full md:w-1/3">
                  <RemoteImage
                    src={
                      typeof formData.profileImage === "string"
                        ? formData.profileImage
                        : ""
                    }
                    width={300}
                    height={300}
                    alt="Profile"
                    priority
                    className="w-full h-64 md:h-60 rounded-2xl object-cover"
                  />
                </div>
              )}

            {/* INFO SECTION */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Info label="Email" value={formData.email} />
                <Info label="Phone" value={formData.phone} />
                <Info label="Location" value={formData.location} />
              </div>

              {/* SOCIAL LINKS */}
              <div className="flex flex-wrap gap-3 pt-2">
                {formData.socialLinks.github && (
                  <Social
                    icon={<AiFillGithub size={18} />}
                    url={formData.socialLinks.github}
                  />
                )}
                {formData.socialLinks.linkedin && (
                  <Social
                    icon={<AiFillLinkedin size={18} />}
                    url={formData.socialLinks.linkedin}
                  />
                )}
                {formData.socialLinks.twitter && (
                  <Social
                    icon={<X size={18} />}
                    url={formData.socialLinks.twitter}
                  />
                )}
                {formData.socialLinks.instagram && (
                  <Social
                    icon={<AiFillInstagram size={18} />}
                    url={formData.socialLinks.instagram}
                  />
                )}
              </div>

              {/* EDIT BUTTON */}
              {user?.role === "ADMIN" && (
                <div className="pt-4">
                  <button
                    onClick={startEdit}
                    className="
              inline-flex
              items-center
              gap-2
              px-5
              py-2.5
              bg-gradient-to-r
              from-violet-600
              to-pink-600
              text-white
              rounded-xl
              hover:shadow-lg
              transition
            "
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <GlassCard>
          <div className="space-y-6">
            {/* BASIC INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Email"
                value={formData.email}
                onChange={(v) => setFormData({ ...formData, email: v })}
              />
              <FormInput
                label="Phone"
                value={formData.phone}
                onChange={(v) => setFormData({ ...formData, phone: v })}
              />
              <FormInput
                label="Location"
                value={formData.location}
                onChange={(v) => setFormData({ ...formData, location: v })}
              />
            </div>

            {/* IMAGE UPLOAD – FULL WIDTH ON MOBILE */}
            <div className="w-full">
              <ImageUpload
                label="Profile Image"
                value={formData.profileImage}
                onChange={(v) => setFormData({ ...formData, profileImage: v })}
              />
            </div>

            {/* SOCIAL LINKS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="GitHub"
                value={formData.socialLinks.github || ""}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    socialLinks: {
                      ...formData.socialLinks,
                      github: v,
                    },
                  })
                }
              />
              <FormInput
                label="LinkedIn"
                value={formData.socialLinks.linkedin || ""}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    socialLinks: {
                      ...formData.socialLinks,
                      linkedin: v,
                    },
                  })
                }
              />
              <FormInput
                label="Twitter"
                value={formData.socialLinks.twitter || ""}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    socialLinks: {
                      ...formData.socialLinks,
                      twitter: v,
                    },
                  })
                }
              />
              <FormInput
                label="Instagram"
                value={formData.socialLinks.instagram || ""}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    socialLinks: {
                      ...formData.socialLinks,
                      instagram: v,
                    },
                  })
                }
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button
                onClick={handleCancel}
                className="
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-2
            bg-gray-600
            text-white
            rounded-xl
          "
              >
                <X className="w-4 h-4" />
                Cancel
              </button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={loading}
                className="
            flex
            items-center
            justify-center
            gap-2
            px-5
            py-2
            bg-green-600
            text-white
            rounded-xl
          "
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-medium">{value || "—"}</p>
    </div>
  );
}

function Social({ icon, url }: { icon: React.ReactNode; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:scale-110 transition"
    >
      {icon}
    </a>
  );
}
