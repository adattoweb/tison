import { useQuery } from "@tanstack/react-query"
import { getPermissions } from "@/api/endpoints/permissions"

export function usePermissions() {
   return useQuery({ queryKey: ["permissions"], queryFn: getPermissions })
}
