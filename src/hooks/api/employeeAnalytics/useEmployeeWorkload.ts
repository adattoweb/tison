import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getEmployeeWorkload, type GetEmployeeWorkloadParams } from "@/api/endpoints/employeeAnalytics"

export function useEmployeeWorkload(employeeId: string | undefined, params: GetEmployeeWorkloadParams = {}) {
   return useQuery({
      queryKey: ["employeeWorkload", employeeId, params],
      queryFn: () => getEmployeeWorkload(employeeId as string, params),
      enabled: !!employeeId,
      placeholderData: keepPreviousData,
   })
}
