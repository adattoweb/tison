import { api } from "@/api/api"
import type { DefectsByOperationTypeRead } from "@/api/types/defectAnalytics"

export interface GetDefectsByOperationTypeParams {
   dateFrom?: string // "YYYY-MM-DD"
   dateTo?: string // "YYYY-MM-DD"
   productModelId?: number
}

export const getDefectsByOperationType = async (
   params: GetDefectsByOperationTypeParams,
): Promise<DefectsByOperationTypeRead[]> => {
   const { data } = await api.get<DefectsByOperationTypeRead[]>("/analytics/defects/by-operation-type", {
      params: {
         date_from: params.dateFrom,
         date_to: params.dateTo,
         product_model_id: params.productModelId,
      },
   })
   return data
}

export interface GetDefectsCountByOperationTypeParams {
   dateFrom?: string // "YYYY-MM-DD"
   dateTo?: string
   productModelId?: number
}

export const getDefectsCountByOperationType = async (
   operationTypeId: number,
   params: GetDefectsCountByOperationTypeParams = {},
): Promise<DefectsByOperationTypeRead> => {
   const { data } = await api.get<DefectsByOperationTypeRead>(
      `/analytics/defects/by-operation-type/${operationTypeId}`,
      {
         params: {
            date_from: params.dateFrom,
            date_to: params.dateTo,
            product_model_id: params.productModelId,
         },
      },
   )
   return data
}

// src/api/endpoints/defectsAnalytics.ts
export interface DefectsDateRangeParams {
   dateFrom?: string // "YYYY-MM-DD"
   dateTo?: string
}

export const getDefectsByProductModel = async (
   productModelId: number,
   params: DefectsDateRangeParams = {},
): Promise<DefectsByOperationTypeRead[]> => {
   const { data } = await api.get<DefectsByOperationTypeRead[]>(
      `/analytics/defects/by-product-model/${productModelId}`,
      {
         params: {
            date_from: params.dateFrom,
            date_to: params.dateTo,
         },
      },
   )
   return data
}
