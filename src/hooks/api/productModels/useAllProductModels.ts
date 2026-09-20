import { useQuery, keepPreviousData } from "@tanstack/react-query"
import type { ParamsWithActive } from "@/types/api"
import { getAllProductModels } from "@/api/endpoints/product_models"

export const useAllProductModels = (params: ParamsWithActive) => {
   return useQuery({
      queryKey: ["models", params],
      queryFn: () => getAllProductModels(params),
      placeholderData: keepPreviousData,
   })
}
