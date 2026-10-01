import { useMutation, useQueryClient } from "@tanstack/react-query"
import { stopWorkSession } from "@/api/endpoints/workSessions"

export function useStopWorkSession() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: stopWorkSession,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["operatorActiveWorkSession"] })
         queryClient.invalidateQueries({ queryKey: ["pausedWorkSessions"] })
      },
   })
}
