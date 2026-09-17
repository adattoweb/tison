import { api } from "@/api/api"
import type { OperationListRead, OperationTypeStats } from "@/api/types/operation"

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
