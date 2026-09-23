import { api } from "@/api/api"
import type { DefectsByOperationType } from "@/api/types/defectAnalytics"

export interface GetDefectsByOperationTypeParams {
   dateFrom?: string // "YYYY-MM-DD"
   dateTo?: string // "YYYY-MM-DD"
   productModelId?: number
}

export const getDefectsByOperationType = async (
   params: GetDefectsByOperationTypeParams,
): Promise<DefectsByOperationType[]> => {
   const { data } = await api.get<DefectsByOperationType[]>("/analytics/defects/by-operation-type", {
      params: {
         date_from: params.dateFrom,
         date_to: params.dateTo,
         product_model_id: params.productModelId,
      },
   })
   return data
}
