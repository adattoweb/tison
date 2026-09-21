import { api } from "@/api/api"
import type { DefectCreateInput, DefectUpdateInput } from "@/api/schemas/defects"
import type { DefectRead } from "@/api/types/defect"
import type { PaginatedResponse } from "@/api/types/pagination"

export interface GetDefectsParams {
   page: number
   pageSize: number
   search?: string
   operationId?: number
   // ISO 8601 з часовим поясом, напр. "2026-09-01T00:00:00Z"
   startFrom?: string
   startTo?: string
   endFrom?: string
   endTo?: string
}

export const getAllDefects = async (params: GetDefectsParams): Promise<PaginatedResponse<DefectRead>> => {
   const { data } = await api.get<PaginatedResponse<DefectRead>>("/defects/", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         search: params.search || undefined,
         operation_id: params.operationId,
         start_from: params.startFrom,
         start_to: params.startTo,
         end_from: params.endFrom,
         end_to: params.endTo,
      },
   })
   return data
}

export const getDefectById = async (id: number): Promise<DefectRead> => {
   const { data } = await api.get<DefectRead>(`/defects/${id}`)
   return data
}

export const createDefect = async (payload: DefectCreateInput): Promise<DefectRead> => {
   const { data } = await api.post<DefectRead>("/defects/", payload)
   return data
}

export const updateDefect = async (id: number, payload: DefectUpdateInput): Promise<DefectRead> => {
   const { data } = await api.put<DefectRead>(`/defects/${id}`, payload)
   return data
}

export const closeDefect = async (id: number): Promise<DefectRead> => {
   const { data } = await api.put<DefectRead>(`/defects/${id}/close`)
   return data
}

export const openDefect = async (id: number): Promise<DefectRead> => {
   const { data } = await api.put<DefectRead>(`/defects/${id}/open`)
   return data
}

export const deleteDefect = async (id: number): Promise<void> => {
   await api.delete(`/defects/${id}`)
}
