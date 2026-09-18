import { useQuery } from "@tanstack/react-query"
import { getStationById } from "@/api/endpoints/stations"

export const useStation = (id: number) => {
   return useQuery({
      queryKey: ["station", id],
      queryFn: () => getStationById(id),
   })
}
