import { getOperationsOverview } from "@/api/endpoints/operationAnalytics"
import { useQuery } from "@tanstack/react-query"

export function useOperationsOverview() {
   return useQuery({
      queryKey: ["operationsOverview"],
      queryFn: getOperationsOverview,
   })
}
