import { useQuery } from "@tanstack/react-query"
import { getOperatorDailySchedule } from "@/api/endpoints/operatorAnalytics"

export function useOperatorDailySchedule(userId: string | undefined) {
   return useQuery({
      queryKey: ["operatorDailySchedule", userId],
      queryFn: () => getOperatorDailySchedule(userId as string),
      enabled: !!userId,
   })
}
