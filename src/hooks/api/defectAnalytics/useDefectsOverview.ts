import { useQuery } from "@tanstack/react-query"
import { getDefectsOverview } from "@/api/endpoints/defectAnalytics"

export function useDefectsOverview() {
   return useQuery({
      queryKey: ["defectsOverview"],
      queryFn: getDefectsOverview,
   })
}
