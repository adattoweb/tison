import { useQuery } from "@tanstack/react-query"
import { getEmployeeSummary } from "@/api/endpoints/employeeAnalytics"
export function useEmployeeSummary(employeeId: string | undefined) {
   return useQuery({
      queryKey: ["employeeSummary", employeeId],
      queryFn: () => getEmployeeSummary(employeeId as string),
      enabled: !!employeeId,
   })
}
