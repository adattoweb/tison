import { useMutation, useQueryClient } from "@tanstack/react-query"
import { dearchiveOperationType } from "@/api/endpoints/operationTypes"

export function useDearchiveOperationType() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: (id: number) => dearchiveOperationType(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["operationTypes"] })
      },
   })
}
