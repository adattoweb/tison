import { useMutation } from "@tanstack/react-query"
import { uploadImage, type MediaCategory } from "@/api/endpoints/media"

export function useUploadImage() {
   return useMutation({
      mutationFn: ({ category, file }: { category: MediaCategory; file: File }) => uploadImage(category, file),
   })
}
