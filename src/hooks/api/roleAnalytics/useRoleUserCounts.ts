import { useQuery } from "@tanstack/react-query"
import { getRoleUserCounts } from "@/api/endpoints/roleAnalytics"

export function useRoleUserCounts() {
   return useQuery({ queryKey: ["roleUserCounts"], queryFn: getRoleUserCounts })
}
