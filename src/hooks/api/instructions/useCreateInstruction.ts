import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createInstruction } from "@/api/endpoints/instructions"

export const useCreateInstruction = () => {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: createInstruction,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["instructions"] })
         queryClient.invalidateQueries({ queryKey: ["models"] })
      },
   })
}
