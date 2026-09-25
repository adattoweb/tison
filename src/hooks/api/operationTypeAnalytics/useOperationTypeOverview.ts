import { getOperationTypesOverview } from "@/api/endpoints/operationTypeAnalytics"
import { useQuery } from "@tanstack/react-query"

export function useOperationTypesOverview() {
   return useQuery({
      queryKey: ["operationTypesOverview"],
      queryFn: getOperationTypesOverview,
   })
}
