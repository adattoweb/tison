import { api } from "@/api/api"
import type { PaginatedResponse } from "@/api/types/pagination"
import type { SessionStatus, WorkSessionRead } from "@/api/types/workSession"

export interface GetWorkSessionsParams {
   page?: number
   pageSize?: number
   operatorId?: string
   result?: SessionStatus
}

export const getWorkSessions = async (params: GetWorkSessionsParams): Promise<PaginatedResponse<WorkSessionRead>> => {
   const { data } = await api.get<PaginatedResponse<WorkSessionRead>>("/work-sessions", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         operator_id: params.operatorId,
         result: params.result,
      },
   })
   return data
}

export const startWorkSession = async (payload: {
   operation_id: number
   station_id: number
}): Promise<WorkSessionRead> => {
   const { data } = await api.post<WorkSessionRead>("/work-sessions", payload)
   return data
}

export const stopWorkSession = async (payload: {
   id: string
   result: SessionStatus
   note?: string
}): Promise<WorkSessionRead> => {
   const { data } = await api.put<WorkSessionRead>(`/work-sessions/${payload.id}`, {
      result: payload.result,
      note: payload.note ?? null,
   })
   return data
}
