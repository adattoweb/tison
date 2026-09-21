import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProduct } from "@/api/endpoints/products"
import type { ProductUpdateInput } from "@/api/schemas/product"

export function useUpdateProduct() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: ProductUpdateInput }) => updateProduct(id, payload),
      onSuccess: (_data, variables) => {
         queryClient.invalidateQueries({ queryKey: ["products"] })
         queryClient.invalidateQueries({ queryKey: ["product", variables.id] })
      },
   })
}
