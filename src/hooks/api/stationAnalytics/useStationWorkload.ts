import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getStationWorkload, type GetStationWorkloadParams } from "@/api/endpoints/stationAnalytics"

export function useStationWorkload(stationId: number, params: GetStationWorkloadParams = {}) {
   return useQuery({
      queryKey: ["stationWorkload", stationId, params],
      queryFn: () => getStationWorkload(stationId, params),
      placeholderData: keepPreviousData,
   })
}
