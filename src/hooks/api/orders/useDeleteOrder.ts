import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteOrder } from "@/api/endpoints/orders"

export function useDeleteOrder() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (id: number) => deleteOrder(id),
      onSuccess: (_data, id) => {
         queryClient.removeQueries({ queryKey: ["order", id] })
         queryClient.invalidateQueries({ queryKey: ["orders"] })
      },
   })
}
