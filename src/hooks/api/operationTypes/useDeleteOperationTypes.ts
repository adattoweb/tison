import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteOperationType } from "@/api/endpoints/operationTypes"

export function useDeleteOperationType(id: number) {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: () => deleteOperationType(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["operationTypes"] })
         queryClient.invalidateQueries({ queryKey: ["operationType", id] })
      },
   })
}
