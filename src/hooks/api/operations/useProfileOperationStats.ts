import { useQuery } from "@tanstack/react-query"
import { getProfileOperationStats } from "@/api/endpoints/operations"

export const useProfileOperationStats = (userId: string | undefined) => {
   return useQuery({
      queryKey: ["profile-operation-stats", userId],
      queryFn: () => getProfileOperationStats(userId!),
      enabled: !!userId,
   })
}
