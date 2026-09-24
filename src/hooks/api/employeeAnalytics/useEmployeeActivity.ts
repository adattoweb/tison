import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getEmployeeActivity, type GetEmployeeActivityParams } from "@/api/endpoints/employeeAnalytics"

export function useEmployeeActivity(employeeId: string | undefined, params: GetEmployeeActivityParams = {}) {
   return useQuery({
      queryKey: ["employeeActivity", employeeId, params],
      queryFn: () => getEmployeeActivity(employeeId as string, params),
      enabled: !!employeeId,
      placeholderData: keepPreviousData,
   })
}
