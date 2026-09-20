import { useQuery } from "@tanstack/react-query"
import { getOrderById } from "@/api/endpoints/order"

export function useOrder(id: number | undefined) {
   return useQuery({
      queryKey: ["order", id],
      queryFn: () => getOrderById(id as number),
      enabled: id !== undefined && !Number.isNaN(id),
   })
}
