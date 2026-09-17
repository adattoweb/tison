import { queryOptions, useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@/api/endpoints/auth"

export const currentUserQueryOptions = queryOptions({
   queryKey: ["currentUser"],
   queryFn: getCurrentUser,
   retry: false,
})

export const useCurrentUser = () => useQuery(currentUserQueryOptions)
