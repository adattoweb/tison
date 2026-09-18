import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOperationType } from "@/api/endpoints/operationTypes"
import type { OperationTypeUpdatePayload } from "@/api/types/operationType"

interface UpdateOperationTypeVariables {
   id: number
   payload: OperationTypeUpdatePayload
}

export function useUpdateOperationType() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: ({ id, payload }: UpdateOperationTypeVariables) => updateOperationType(id, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["operationTypes"] }),
   })
}
