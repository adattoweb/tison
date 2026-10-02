import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllStations, type GetStationsParams } from "@/api/endpoints/stations"

export function useAllStations(params: GetStationsParams) {
   return useQuery({
      queryKey: ["stations", params],
      queryFn: () => getAllStations(params),
      placeholderData: keepPreviousData,
   })
}
