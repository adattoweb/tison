import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOperation } from "@/api/endpoints/operations"
import type { OperationUpdatePayload } from "@/api/types/operation"

export function useUpdateOperation() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: OperationUpdatePayload }) => updateOperation(id, payload),
      onSuccess: (_data, variables) => {
         queryClient.invalidateQueries({ queryKey: ["operations"] })
         queryClient.invalidateQueries({ queryKey: ["operation", variables.id] })
      },
   })
}
