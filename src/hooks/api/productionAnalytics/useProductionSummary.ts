import { useQuery } from "@tanstack/react-query"
import { getProductionSummary, type GetProductionSummaryParams } from "@/api/endpoints/productionAnalytics"

export function useProductionSummary(params: GetProductionSummaryParams = {}) {
   return useQuery({
      queryKey: ["productionSummary", params],
      queryFn: () => getProductionSummary(params),
   })
}
