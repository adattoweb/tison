import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@/api/endpoints/auth"

export const useCurrentUser = () => {
   return useQuery({
      queryKey: ["currentUser"],
      queryFn: getCurrentUser,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
   })
}
