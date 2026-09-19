import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteProductModel } from "@/api/endpoints/product_models"

export function useDeleteProductModel(id: number) {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: () => deleteProductModel(id),
      onSuccess: product_model => {
         queryClient.invalidateQueries({ queryKey: ["models"] })
         queryClient.invalidateQueries({ queryKey: ["model", product_model.id] })
      },
   })
}
