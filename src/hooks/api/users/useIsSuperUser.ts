import { useQuery } from "@tanstack/react-query"
import { getIsSuperUser } from "@/api/endpoints/users"

export function useIsSuperUser(id: string | undefined) {
   return useQuery({
      queryKey: ["user_is_super_user", id],
      queryFn: () => getIsSuperUser(id as string),
   })
}
