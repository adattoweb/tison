import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createWorkSession } from "@/api/endpoints/workSessions"

export function useCreateWorkSession() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: createWorkSession,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["workSessions"] })
         queryClient.invalidateQueries({ queryKey: ["operatorActiveWorkSession"] })
      },
   })
}
