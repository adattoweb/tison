import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteDepartment } from "@/api/endpoints/departments"

export function useDeleteDepartment(id: number) {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: () => deleteDepartment(id),
      onSuccess: product_model => {
         queryClient.invalidateQueries({ queryKey: ["models"] })
         queryClient.invalidateQueries({ queryKey: ["model", product_model.id] })
      },
   })
}
