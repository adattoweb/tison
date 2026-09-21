import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createDefect } from "@/api/endpoints/defects"
import type { DefectCreateInput } from "@/api/schemas/defect"

export function useCreateDefect() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (payload: DefectCreateInput) => createDefect(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["defects"] })
      },
   })
}
