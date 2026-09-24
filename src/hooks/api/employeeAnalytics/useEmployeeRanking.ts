import { useQuery } from "@tanstack/react-query"
import { getEmployeeRanking, type GetEmployeeRankingParams } from "@/api/endpoints/employeeAnalytics"

export function useEmployeeRanking(params: GetEmployeeRankingParams = {}) {
   return useQuery({
      queryKey: ["employeeRanking", params],
      queryFn: () => getEmployeeRanking(params),
   })
}
