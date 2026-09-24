import { getProductSummary } from "@/api/endpoints/productionAnalytics"
import { useQuery } from "@tanstack/react-query"

export function useProductSummary(productId: number | undefined) {
   return useQuery({
      queryKey: ["productSummary", productId],
      queryFn: () => getProductSummary(productId as number),
      enabled: Number.isFinite(productId),
   })
}
