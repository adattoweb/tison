import { useQuery } from "@tanstack/react-query"
import { getOperatorActiveWorkSession } from "@/api/endpoints/operatorAnalytics"

export function useOperatorActiveWorkSession(userId: string | undefined) {
   return useQuery({
      queryKey: ["operatorActiveWorkSession", userId],
      queryFn: () => getOperatorActiveWorkSession(userId as string),
      enabled: !!userId,
   })
}
