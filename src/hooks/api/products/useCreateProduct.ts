import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "@/api/endpoints/products"
import type { ProductCreateInput } from "@/api/schemas/product"

export function useCreateProduct() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (payload: ProductCreateInput) => createProduct(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["products"] })
      },
   })
}
