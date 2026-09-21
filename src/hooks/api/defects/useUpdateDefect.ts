import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateDefect } from "@/api/endpoints/defects"
import type { DefectUpdateInput } from "@/api/schemas/defects"

export function useUpdateDefect() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: DefectUpdateInput }) => updateDefect(id, payload),
      onSuccess: (_data, variables) => {
         queryClient.invalidateQueries({ queryKey: ["defects"] })
         queryClient.invalidateQueries({ queryKey: ["defect", variables.id] })
      },
   })
}
