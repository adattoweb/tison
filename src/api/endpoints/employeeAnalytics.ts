import { api } from "@/api/api"
import type { EmployeeRanking } from "@/api/types/employeeAnalytics"

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
