import { useQuery } from "@tanstack/react-query"
import { getStationWorkedProducts, type GetStationRecentParams } from "@/api/endpoints/stationAnalytics"

export function useStationWorkedProducts(stationId: number, params: GetStationRecentParams = {}) {
   return useQuery({
      queryKey: ["stationWorkedProducts", stationId, params],
      queryFn: () => getStationWorkedProducts(stationId, params),
   })
}
