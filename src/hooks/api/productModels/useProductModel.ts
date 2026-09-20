import { useQuery } from "@tanstack/react-query"
import { getProductModelById } from "@/api/endpoints/productModels"

export const useProductModel = (id: number) => {
   return useQuery({
      queryKey: ["model", id],
      queryFn: () => getProductModelById(id),
   })
}
