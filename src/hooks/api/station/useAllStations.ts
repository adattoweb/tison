import { getAllStations } from "@/api/endpoints/stations"
import { useQuery } from "@tanstack/react-query"

export const useAllStations = () => {
   return useQuery({
      queryKey: ["stations"],
      queryFn: getAllStations,
      retry: false,
   })
}
