import { useQuery } from "@tanstack/react-query"
import {
   getProductionAnalyticsChart,
   type GetProductionAnalyticsChartParams,
} from "@/api/endpoints/productionAnalytics"

export function useProductionAnalyticsChart(params: GetProductionAnalyticsChartParams) {
   return useQuery({
      queryKey: ["productionAnalyticsChart", params],
      queryFn: () => getProductionAnalyticsChart(params),
   })
}
