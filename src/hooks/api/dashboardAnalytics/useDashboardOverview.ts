import { getDashboardOverview } from "@/api/endpoints/dashboardAnalytics"
import { useQuery } from "@tanstack/react-query"

export function useDashboardOverview() {
   return useQuery({
      queryKey: ["dashboardOverview"],
      queryFn: getDashboardOverview,
   })
}
