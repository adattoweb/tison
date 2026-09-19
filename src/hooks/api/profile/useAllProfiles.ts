import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getAllProfiles } from "@/api/endpoints/profiles"
import type { ParamsWithShift } from "@/types/api"

export const useAllProfiles = (params: ParamsWithShift) => {
   return useQuery({
      queryKey: ["profiles", params],
      queryFn: () => getAllProfiles(params),
      placeholderData: keepPreviousData,
   })
}
