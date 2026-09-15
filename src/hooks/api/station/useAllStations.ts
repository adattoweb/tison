import { getAllStations } from "@/api/endpoints/station"
import { useQuery } from "@tanstack/react-query"

export const useAllStations = () => {
   return useQuery({
      queryKey: ["stations"],
      queryFn: getAllStations,
      retry: false,
   })
}
