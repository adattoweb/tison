import { useQuery } from "@tanstack/react-query"
import { getShifts } from "@/api/endpoints/shifts"

export const useShifts = () => {
   return useQuery({
      queryKey: ["shifts"],
      queryFn: getShifts,
      staleTime: 5 * 60 * 1000,
   })
}
