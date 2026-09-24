// src/hooks/api/product/useProductHistory.ts

import { getProductHistory } from "@/api/endpoints/productionAnalytics"
import { useQuery } from "@tanstack/react-query"

export function useProductHistory(productId: number) {
   return useQuery({
      queryKey: ["productHistory", productId],
      queryFn: () => getProductHistory(productId),
      enabled: Number.isFinite(productId),
   })
}
