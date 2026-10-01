import { useMutation, useQueryClient } from "@tanstack/react-query"
import { endWorkSession } from "@/api/endpoints/workSessions"
import type { WorkSessionEndInput } from "@/api/schemas/workSession"

export function useEndWorkSession() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: WorkSessionEndInput }) => endWorkSession(id, payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["workSessions"] })
         queryClient.invalidateQueries({ queryKey: ["operatorActiveWorkSession"] })
         queryClient.invalidateQueries({ queryKey: ["pausedWorkSessions"] })
      },
   })
}
