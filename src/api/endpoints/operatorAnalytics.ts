import { api } from "@/api/api"
import type { OperatorDailySchedule } from "@/api/types/operatorSchedule"
import type { WorkSessionRead } from "@/api/types/workSession"

export const getOperatorDailySchedule = async (userId: string, day?: string): Promise<OperatorDailySchedule> => {
   const { data } = await api.get<OperatorDailySchedule>(`/analytics/operator/${userId}/schedule`, {
      params: { day },
   })
   return data
}

export const getOperatorActiveWorkSession = async (userId: string): Promise<WorkSessionRead | null> => {
   const { data } = await api.get<WorkSessionRead | null>(`/analytics/operator/worksession/${userId}`)
   return data
}
