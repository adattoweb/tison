import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteDefect } from "@/api/endpoints/defects"

export function useDeleteDefect() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (id: number) => deleteDefect(id),
      onSuccess: (_data, id) => {
         queryClient.removeQueries({ queryKey: ["defect", id] })
         queryClient.invalidateQueries({ queryKey: ["defects"] })
      },
   })
}
