import { useQuery } from "@tanstack/react-query"
import { getWorkSessions } from "@/api/endpoints/workSessions"

export function usePausedWorkSessions(operatorId: string | undefined) {
   return useQuery({
      queryKey: ["pausedWorkSessions", operatorId],
      queryFn: () => getWorkSessions({ operatorId, result: "PAUSED", pageSize: 50 }),
      enabled: !!operatorId,
   })
}
