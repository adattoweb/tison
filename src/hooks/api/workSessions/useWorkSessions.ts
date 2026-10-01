import { useQuery } from "@tanstack/react-query"
import { getWorkSessions, type GetWorkSessionsParams } from "@/api/endpoints/workSessions"

export function useWorkSessions(params: GetWorkSessionsParams = {}) {
   return useQuery({
      queryKey: ["workSessions", params],
      queryFn: () => getWorkSessions(params),
   })
}
