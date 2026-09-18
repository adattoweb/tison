import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteStation } from "@/api/endpoints/stations"

export function useDeleteStation(id: number) {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: () => deleteStation(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["stations"] })
         queryClient.invalidateQueries({ queryKey: ["station"] })
      },
   })
}
