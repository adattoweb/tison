import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateOrder } from "@/api/endpoints/order"
import type { OrderUpdateInput } from "@/api/schemas/order"

export function useUpdateOrder() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: OrderUpdateInput }) => updateOrder(id, payload),
      onSuccess: (_data, variables) => {
         queryClient.invalidateQueries({ queryKey: ["orders"] })
         queryClient.invalidateQueries({ queryKey: ["order", variables.id] })
      },
   })
}
