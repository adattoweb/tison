import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteInstruction } from "@/api/endpoints/instructions"

export function useDeleteInstruction() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (id: number) => deleteInstruction(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["models"] }),
   })
}
