import { getOperatorActiveWorkSession } from "@/api/endpoints/operatorAnalytics"
import { useQuery } from "@tanstack/react-query"

export function useCurrentWorkSession() {
   return useQuery({
      queryKey: ["workSessions", "current"],
      queryFn: getOperatorActiveWorkSession,
   })
}
