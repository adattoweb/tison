import { useQuery, keepPreviousData } from "@tanstack/react-query"
import type { ModelParams } from "@/types/api"
import { getAllProductModels } from "@/api/endpoints/productModels"

export const useAllProductModels = (params: ModelParams) => {
   return useQuery({
      queryKey: ["models", params],
      queryFn: () => getAllProductModels(params),
      placeholderData: keepPreviousData,
   })
}
