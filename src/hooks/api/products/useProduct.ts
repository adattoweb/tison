import { useQuery } from "@tanstack/react-query"
import { getProductById } from "@/api/endpoints/products"

export function useProduct(id?: number) {
   return useQuery({
      queryKey: ["product", id],
      queryFn: () => getProductById(id as number),
      enabled: id !== undefined,
   })
}
