import { useMutation, useQueryClient } from "@tanstack/react-query"
import { startOperation, completeOperation } from "@/api/endpoints/operations"
import type { OperationStartPayload } from "@/api/types/operation"

export function useStartOperation() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: OperationStartPayload }) => startOperation(id, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["operations"] }),
   })
}

export function useCompleteOperation() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (id: number) => completeOperation(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["operations"] }),
   })
}
