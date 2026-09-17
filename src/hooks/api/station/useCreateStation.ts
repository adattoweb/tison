import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createStation } from "@/api/endpoints/stations"

export function useCreateStation() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: createStation,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stations"] }),
   })
}
