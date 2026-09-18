import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "@/api/endpoints/products"
import type { ProductCreatePayload } from "@/api/types/product"

export function useCreateProduct() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (payload: ProductCreatePayload) => createProduct(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["products"] })
      },
   })
}
