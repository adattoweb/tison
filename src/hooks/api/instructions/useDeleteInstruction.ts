import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteInstruction } from "@/api/endpoints/instructions"

export function useDeleteInstruction(id: number) {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: () => deleteInstruction(id),
      onSuccess: instructions => {
         queryClient.invalidateQueries({ queryKey: ["instructions"] })
         queryClient.removeQueries({ queryKey: ["instruction", instructions.id] })
      },
   })
}
