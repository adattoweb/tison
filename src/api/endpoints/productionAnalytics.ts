import { api } from "@/api/api"
import type { ProductHistoryEvent, ProductionAnalyticsPoint, ProductionSummary } from "@/api/types/productionAnalytics"

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

export interface GetProductionSummaryParams {
   days?: number
   productModelId?: number
}

export const getProductionSummary = async (params: GetProductionSummaryParams = {}): Promise<ProductionSummary> => {
   const { data } = await api.get<ProductionSummary>("/analytics/production/summary", {
      params: {
         days: params.days,
         product_model_id: params.productModelId,
      },
   })
   return data
}

export const getProductHistory = async (productId: number): Promise<ProductHistoryEvent[]> => {
   const { data } = await api.get<ProductHistoryEvent[]>(`analytics/production/${productId}/history`)
   return data
}
