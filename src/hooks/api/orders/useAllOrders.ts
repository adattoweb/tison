import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getAllOrders } from "@/api/endpoints/orders"
import type { OrdersParams } from "@/types/api"

export const useAllOrders = (params: OrdersParams) => {
   return useQuery({
      queryKey: ["orders", params],
      queryFn: () => getAllOrders(params),
      placeholderData: keepPreviousData,
   })
}
