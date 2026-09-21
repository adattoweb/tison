import { useQuery } from "@tanstack/react-query"
import { getMe } from "@/api/endpoints/auth"

export function useMe() {
   return useQuery({
      queryKey: ["me"],
      queryFn: getMe,
      staleTime: 5 * 60 * 1000,
      retry: false,
   })
}
