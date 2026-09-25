import { api } from "@/api/api"
import type {
   EmployeeActivityPage,
   EmployeeRanking,
   EmployeeSummary,
   EmployeeWorkloadPage,
} from "@/api/types/employeeAnalytics"

export interface GetEmployeeRankingParams {
   limit?: number
   includeMyRank?: boolean
}

export const getEmployeeRanking = async (params: GetEmployeeRankingParams = {}): Promise<EmployeeRanking> => {
   const { data } = await api.get<EmployeeRanking>("/analytics/employees/ranking", {
      params: {
         limit: params.limit,
         include_my_rank: params.includeMyRank,
      },
   })
   return data
}
export interface GetEmployeeActivityParams {
   page?: number
   pageSize?: number
}

export const getEmployeeActivity = async (
   employeeId: string,
   params: GetEmployeeActivityParams = {},
): Promise<EmployeeActivityPage> => {
   const { data } = await api.get<EmployeeActivityPage>(`/analytics/employees/${employeeId}/activity`, {
      params: {
         page: params.page,
         page_size: params.pageSize,
      },
   })
   return data
}

export interface GetEmployeeWorkloadParams {
   page?: number
   pageSize?: number
}

export const getEmployeeWorkload = async (
   employeeId: string,
   params: GetEmployeeWorkloadParams = {},
): Promise<EmployeeWorkloadPage> => {
   const { data } = await api.get<EmployeeWorkloadPage>(`/analytics/employees/${employeeId}/workload`, {
      params: {
         page: params.page,
         page_size: params.pageSize,
      },
   })
   return data
}

export const getEmployeeSummary = async (employeeId: string): Promise<EmployeeSummary> => {
   const { data } = await api.get<EmployeeSummary>(`/analytics/employees/${employeeId}/summary`)
   return data
}
