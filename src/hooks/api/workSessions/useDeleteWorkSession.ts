import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteWorkSession } from "@/api/endpoints/workSessions"

export function useDeleteWorkSession() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: deleteWorkSession,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["workSessions"] }),
   })
}
