import { useQuery } from "@tanstack/react-query"
import { getProfileByUserId } from "@/api/endpoints/profiles"

export const useProfile = (userId: string | undefined) => {
   return useQuery({
      queryKey: ["profile", userId],
      queryFn: () => getProfileByUserId(userId!),
      enabled: !!userId,
   })
}
