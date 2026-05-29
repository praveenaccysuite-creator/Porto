// src/services/portfolioInfo.service.ts
import api from "@/lib/api";
import { PortfolioInfo } from "@/types/portfolio";


export const portfolioInfoService = {
  getInfo: async (): Promise<PortfolioInfo | null> => {
    const res = await api.get("/info");
    return res.data.data ?? null;
  },

  save: async (data: PortfolioInfo) => {
    const formData = new FormData();

    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("location", data.location);
    formData.append("socialLinks", JSON.stringify(data.socialLinks));

    if (data.profileImage instanceof File) {
      formData.append("profileImage", data.profileImage);
    }

    const res = await api.post("/info/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.data;
  },
};
