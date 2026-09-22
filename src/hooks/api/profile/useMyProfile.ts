import { useQuery } from "@tanstack/react-query"

import { getMyProfile } from "@/api/endpoints/profiles"

export function useMyProfile() {
   return useQuery({
      queryKey: ["profile", "me"],
      queryFn: getMyProfile,
   })
}
