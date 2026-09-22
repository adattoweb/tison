import { useQuery } from "@tanstack/react-query"

import { getProfileByUserId } from "@/api/endpoints/profiles"

export function useProfileByUserId(userId: string) {
   return useQuery({
      queryKey: ["profile", userId],
      queryFn: () => getProfileByUserId(userId),
      enabled: !!userId,
   })
}
