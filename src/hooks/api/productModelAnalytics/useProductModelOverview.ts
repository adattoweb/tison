import { getProductModelsOverview } from "@/api/endpoints/productModelAnalytics"
import { useQuery } from "@tanstack/react-query"

export function useProductModelsOverview() {
   return useQuery({
      queryKey: ["productModelsOverview"],
      queryFn: getProductModelsOverview,
   })
}
