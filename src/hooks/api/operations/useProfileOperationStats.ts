import { useQuery } from "@tanstack/react-query"

import { getProfileOperationStats } from "@/api/endpoints/profiles"

export function useProfileOperationStats(userId: string) {
   return useQuery({
      queryKey: ["profile", userId, "operations", "stats"],
      queryFn: () => getProfileOperationStats(userId),
      enabled: !!userId,
   })
}
