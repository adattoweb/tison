import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/api/endpoints/users"

export function useUser(id: string | undefined) {
   return useQuery({
      queryKey: ["users"],
      queryFn: () => getUser(id as string),
      enabled: id !== undefined,
   })
}
