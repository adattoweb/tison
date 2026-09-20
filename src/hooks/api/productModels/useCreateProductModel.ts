import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProductModel } from "@/api/endpoints/product_models"

export const useCreateProductModel = () => {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: createProductModel,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["models"] })
      },
   })
}
