import { getEmployeesOverview } from "@/api/endpoints/employeeAnalytics"
import { useQuery } from "@tanstack/react-query"

export function useEmployeesOverview() {
   return useQuery({
      queryKey: ["employeesOverview"],
      queryFn: getEmployeesOverview,
   })
}
