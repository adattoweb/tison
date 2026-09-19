import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateInstruction } from "@/api/endpoints/instructions"
import type { InstructionUpdateInput } from "@/api/schemas/instruction"

export function useUpdateInstruction() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: InstructionUpdateInput }) => updateInstruction(id, payload),
      onSuccess: (_data, variables) => {
         queryClient.invalidateQueries({ queryKey: ["instructions"] })
         queryClient.invalidateQueries({ queryKey: ["instruction", variables.id] })
      },
   })
}
