import { api } from "@/api/api"
import type { PaginatedResponse } from "@/api/types/pagination"
import type { SessionStatus, WorkSessionRead, WorkSessionResponse } from "@/api/types/workSession"
import type { WorkSessionCreateInput, WorkSessionEndInput } from "@/api/schemas/workSession"

export interface GetWorkSessionsParams {
   page?: number
   pageSize?: number
   startedFrom?: string
   startedTo?: string
   endedFrom?: string
   endedTo?: string
   result?: SessionStatus
   operatorId?: string
   operationId?: number
   stationId?: number
   productId?: number
}

export const getWorkSessions = async (
   params: GetWorkSessionsParams = {},
): Promise<PaginatedResponse<WorkSessionRead>> => {
   const { data } = await api.get<PaginatedResponse<WorkSessionRead>>("/work-sessions", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         started_from: params.startedFrom,
         started_to: params.startedTo,
         ended_from: params.endedFrom,
         ended_to: params.endedTo,
         result: params.result,
         operator_id: params.operatorId,
         operation_id: params.operationId,
         station_id: params.stationId,
         product_id: params.productId,
      },
   })
   return data
}

export const getWorkSessionById = async (id: string): Promise<WorkSessionRead> => {
   const { data } = await api.get<WorkSessionRead>(`/work-sessions/${id}`)
   return data
}

export const createWorkSession = async (payload: WorkSessionCreateInput): Promise<WorkSessionResponse> => {
   const { data } = await api.post<WorkSessionResponse>("/work-sessions", payload)
   return data
}

export const endWorkSession = async (id: string, payload: WorkSessionEndInput): Promise<WorkSessionRead> => {
   const { data } = await api.patch<WorkSessionRead>(`/work-sessions/${id}/end`, payload)
   return data
}

export const deleteWorkSession = async (id: string): Promise<void> => {
   await api.delete(`/work-sessions/${id}`)
}
