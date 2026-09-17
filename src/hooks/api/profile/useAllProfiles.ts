import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getAllProfiles } from "@/api/endpoints/profiles"

interface UseAllProfilesParams {
   page: number
   pageSize: number
   search?: string
   shiftId?: number
}

export const useAllProfiles = (params: UseAllProfilesParams) => {
   return useQuery({
      queryKey: ["profiles", params],
      queryFn: () => getAllProfiles(params),
      placeholderData: keepPreviousData,
   })
}
