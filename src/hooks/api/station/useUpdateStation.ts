import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStation } from "@/api/endpoints/stations"
import type { StationUpdatePayload } from "@/api/types/station"

export function useUpdateStation(id: number) {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: (payload: StationUpdatePayload) => updateStation(id, payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["stations"] })
         queryClient.invalidateQueries({ queryKey: ["station"] })
      },
   })
}
