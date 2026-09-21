import { useMutation, useQueryClient } from "@tanstack/react-query"
import { closeDefect } from "@/api/endpoints/defects"

export function useCloseDefect() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (id: number) => closeDefect(id),
      onSuccess: (_data, id) => {
         queryClient.invalidateQueries({ queryKey: ["defects"] })
         queryClient.invalidateQueries({ queryKey: ["defect", id] })
      },
   })
}
