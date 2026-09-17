import { useQuery } from "@tanstack/react-query"
import { getProfileOperations } from "@/api/endpoints/operations"

export const useProfileOperations = (userId: string | undefined, limit = 10) => {
   return useQuery({
      queryKey: ["profile-operations", userId, limit],
      queryFn: () => getProfileOperations(userId!, limit),
      enabled: !!userId,
   })
}
