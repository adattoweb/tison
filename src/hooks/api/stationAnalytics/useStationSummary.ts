import { useQuery } from "@tanstack/react-query"
import { getStationSummary } from "@/api/endpoints/stationAnalytics"

export function useStationSummary(stationId: number | undefined) {
   return useQuery({
      queryKey: ["stationSummary", stationId],
      queryFn: () => getStationSummary(stationId as number),
      enabled: Number.isFinite(stationId),
   })
}
