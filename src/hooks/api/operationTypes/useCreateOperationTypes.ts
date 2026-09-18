import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createOperationType } from "@/api/endpoints/operationTypes"

export function useCreateOperationType() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: createOperationType,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["operationTypes"] }),
   })
}
