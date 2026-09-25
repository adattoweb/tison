import { useQuery } from "@tanstack/react-query"
import { getStationsOverview } from "@/api/endpoints/stationAnalytics"

export function useStationsOverview() {
   return useQuery({
      queryKey: ["stationsOverview"],
      queryFn: getStationsOverview,
   })
}
