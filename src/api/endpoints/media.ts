import { api } from "@/api/api"

export type MediaCategory = "defects" | "product_models" | "profiles"

export interface UploadedImage {
   url: string
}

export const uploadImage = async (category: MediaCategory, file: File): Promise<UploadedImage> => {
   const formData = new FormData()
   formData.append("file", file)

   const { data } = await api.post<UploadedImage>("/media/upload", formData, {
      params: { category },
      headers: { "Content-Type": "multipart/form-data" },
   })
   return data
}
