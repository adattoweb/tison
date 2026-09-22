import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteStation } from "@/api/endpoints/stations"

export function useDeleteStation() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: (id: number) => deleteStation(id),
      onSuccess: (_data, id) => {
         queryClient.invalidateQueries({ queryKey: ["stations"] })
         queryClient.removeQueries({ queryKey: ["station", id] })
      },
   })
}
