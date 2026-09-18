import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteOperation } from "@/api/endpoints/operations"

export function useDeleteOperation() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (id: number) => deleteOperation(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["operations"] })
      },
   })
}
