import { useQuery } from "@tanstack/react-query"
import { getIsUserActive } from "@/api/endpoints/users"

export function useIsUserActive(id: string | undefined) {
   return useQuery({
      queryKey: ["user_is_active", id],
      queryFn: () => getIsUserActive(id as string),
      enabled: id !== undefined,
   })
}
