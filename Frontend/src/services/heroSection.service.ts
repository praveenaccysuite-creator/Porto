// services/heroSection.service.ts
import api from "@/lib/api";

export interface heroInfo {
  id: number;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export const heroService = {
  getInfo: async (): Promise<heroInfo | null> => {
    try {
      const res = await api.get("/hero");
      return res.data.data ?? null;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Unable to fetch hero info"
      );
    }
  },

  updateInfo: async (bio: string): Promise<heroInfo> => {
    try {
      const res = await api.post("/hero/create", { bio });
      return res.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Unable to update hero info"
      );
    }
  },
};
