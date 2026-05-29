import api from "@/lib/api";

export interface documents {
  title: string;
  file?: File;
  fileUrl?: string;
}

export interface aboutInfo {
  id: number;
  bio: string;
  imageUrl: string;
  specialization: string;
  education: string;
  documents: documents;
  createdAt: string;
  updatedAt: string;
}

export interface AboutFormData {
  bio: string;
  image: File | string;
  specialization: string;
  education: string;
  documents: documents;
}

export const aboutService = {
  getInfo: async (): Promise<aboutInfo | null> => {
    const res = await api.get("/about");
    return res.data.data ?? null;
  },

updateInfo: async (data: AboutFormData): Promise<aboutInfo> => {
  const formData = new FormData();

  formData.append("bio", data.bio);
  formData.append("specialization", data.specialization);
  formData.append("education", data.education);

  formData.append("title", data.documents.title);

  if (data.image instanceof File) {
    formData.append("aboutImage", data.image);
  }

  if (data.documents.file instanceof File) {
    formData.append("document", data.documents.file);
  }

  const res = await api.post("/about/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.data;
},


};
