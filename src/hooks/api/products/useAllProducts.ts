import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllProducts, type GetProductsParams } from "@/api/endpoints/products"

export function useAllProducts(params: GetProductsParams) {
   return useQuery({
      queryKey: ["products", params],
      queryFn: () => getAllProducts(params),
      placeholderData: keepPreviousData,
   })
}
