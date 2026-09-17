import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getAllProfiles } from "@/api/endpoints/profiles"
import type { ProfileParams } from "@/types/api"

export const useAllProfiles = (params: ProfileParams) => {
   return useQuery({
      queryKey: ["profiles", params],
      queryFn: () => getAllProfiles(params),
      placeholderData: keepPreviousData,
   })
}
