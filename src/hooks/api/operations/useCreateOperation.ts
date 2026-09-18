import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createOperation } from "@/api/endpoints/operations"
import type { OperationCreatePayload } from "@/api/types/operation"

export function useCreateOperation() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (payload: OperationCreatePayload) => createOperation(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["operations"] })
      },
   })
}
