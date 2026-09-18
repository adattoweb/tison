import { useMutation, useQueryClient } from "@tanstack/react-query"
import { archiveOperationType } from "@/api/endpoints/operationTypes"

export function useArchiveOperationType() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: (id: number) => archiveOperationType(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["operationTypes"] }),
   })
}
