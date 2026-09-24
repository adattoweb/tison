import { getProductsOverview } from "@/api/endpoints/productionAnalytics"
import { useQuery } from "@tanstack/react-query"

export function useProductsOverview() {
   return useQuery({
      queryKey: ["productsOverview"],
      queryFn: getProductsOverview,
   })
}
