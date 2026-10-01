import { useQuery } from "@tanstack/react-query"
import { getWorkSessionById } from "@/api/endpoints/workSessions"

export function useWorkSession(id: string | undefined) {
   return useQuery({
      queryKey: ["workSession", id],
      queryFn: () => getWorkSessionById(id as string),
      enabled: !!id,
   })
}
