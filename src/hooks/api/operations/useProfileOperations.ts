import { useQuery } from "@tanstack/react-query"

import { getProfileOperations } from "@/api/endpoints/profiles"

export function useProfileOperations(userId: string, limit = 10) {
   return useQuery({
      queryKey: ["profile", userId, "operations", limit],
      queryFn: () => getProfileOperations(userId, limit),
      enabled: !!userId,
   })
}
