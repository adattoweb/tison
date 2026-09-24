import { useQuery } from "@tanstack/react-query"
import { getStationRecentWorkSessions, type GetStationRecentParams } from "@/api/endpoints/stationAnalytics"

export function useStationRecentWorkSessions(stationId: number, params: GetStationRecentParams = {}) {
   return useQuery({
      queryKey: ["stationRecentWorkSessions", stationId, params],
      queryFn: () => getStationRecentWorkSessions(stationId, params),
   })
}
