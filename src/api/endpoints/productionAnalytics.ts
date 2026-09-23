import { api } from "@/api/api"
import type { ProductionAnalyticsPoint } from "@/api/types/productionAnalytics"

export interface GetProductionAnalyticsChartParams {
   dateFrom: string // "YYYY-MM-DD"
   dateTo: string // "YYYY-MM-DD"
   productModelId?: number
}

export const getProductionAnalyticsChart = async (
   params: GetProductionAnalyticsChartParams,
): Promise<ProductionAnalyticsPoint[]> => {
   const { data } = await api.get<ProductionAnalyticsPoint[]>("/analytics/production/chart", {
      params: {
         date_from: params.dateFrom,
         date_to: params.dateTo,
         product_model_id: params.productModelId,
      },
   })
   return data
}
