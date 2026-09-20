import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProductModel } from "@/api/endpoints/productModels"
import type { ProductModelUpdatePayload } from "@/api/types/product_model"

export function useUpdateProductModel() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: ProductModelUpdatePayload }) =>
         updateProductModel(id, payload),
      onSuccess: (_data, variables) => {
         queryClient.invalidateQueries({ queryKey: ["models"] })
         queryClient.invalidateQueries({ queryKey: ["model", variables.id] })
      },
   })
}
