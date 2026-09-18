import { api } from "@/api/api"
import type { PaginatedResponse } from "../types/pagination"
import type {
   OperationListRead,
   OperationCreatePayload,
   OperationUpdatePayload,
   OperationStartPayload,
   OperationTypeStats,
} from "../types/operation"
import type { StatusType } from "@/types/status"

export interface GetOperationsParams {
   page: number
   pageSize: number
   /** пошук за кодом операції */
   search?: string
   status?: StatusType
   stationId?: number
   orderId?: number
   /** секунди */
   minDuration?: number
   /** секунди */
   maxDuration?: number
}

export const getProfileOperations = async (userId: string, limit = 10): Promise<OperationListRead[]> => {
   const { data } = await api.get<OperationListRead[]>(`/profile/${userId}/operations`, {
      params: { limit },
   })
   return data
}

export const getProfileOperationStats = async (userId: string): Promise<OperationTypeStats[]> => {
   const { data } = await api.get<OperationTypeStats[]>(`/profile/${userId}/operations/stats`)
   return data
}

export const getAllOperations = async (params: GetOperationsParams): Promise<PaginatedResponse<OperationListRead>> => {
   const { data } = await api.get<PaginatedResponse<OperationListRead>>("/operations/", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         search: params.search,
         status: params.status,
         station_id: params.stationId,
         order_id: params.orderId,
         min_duration: params.minDuration,
         max_duration: params.maxDuration,
      },
   })
   return data
}

export const getOperationById = async (id: number): Promise<OperationListRead> => {
   const { data } = await api.get<OperationListRead>(`/operations/${id}`)
   return data
}

export const createOperation = async (payload: OperationCreatePayload): Promise<OperationListRead> => {
   const { data } = await api.post<OperationListRead>("/operations/", payload)
   return data
}

export const updateOperation = async (id: number, payload: OperationUpdatePayload): Promise<OperationListRead> => {
   const { data } = await api.put<OperationListRead>(`/operations/${id}`, payload)
   return data
}

export const startOperation = async (id: number, payload: OperationStartPayload): Promise<OperationListRead> => {
   const { data } = await api.put<OperationListRead>(`/operations/${id}/start`, payload)
   return data
}

export const completeOperation = async (id: number): Promise<OperationListRead> => {
   const { data } = await api.put<OperationListRead>(`/operations/${id}/complete`)
   return data
}

export const deleteOperation = async (id: number): Promise<void> => {
   await api.delete(`/operations/${id}`)
}
