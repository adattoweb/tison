import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllProducts } from "@/api/endpoints/products"
import type { ProductsParams } from "@/types/api"

export function useAllProducts(params: ProductsParams) {
   return useQuery({
      queryKey: ["products", params],
      queryFn: () => getAllProducts(params),
      placeholderData: keepPreviousData,
   })
}
