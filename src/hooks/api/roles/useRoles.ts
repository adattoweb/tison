import { useQuery } from "@tanstack/react-query"
import { getRoles } from "@/api/endpoints/roles"

export const useRoles = () => {
   return useQuery({
      queryKey: ["roles"],
      queryFn: getRoles,
      staleTime: 5 * 60 * 1000, // довідник, не змінюється щохвилини
   })
}
