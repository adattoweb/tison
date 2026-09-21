import { useMutation, useQueryClient } from "@tanstack/react-query"
import { openDefect } from "@/api/endpoints/defects"

export function useOpenDefect() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (id: number) => openDefect(id),
      onSuccess: (_data, id) => {
         queryClient.invalidateQueries({ queryKey: ["defects"] })
         queryClient.invalidateQueries({ queryKey: ["defect", id] })
      },
   })
}
