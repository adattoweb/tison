import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteDepartment } from "@/api/endpoints/departments"

export function useDeleteDepartment(id: number) {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: () => deleteDepartment(id),
      onSuccess: department => {
         queryClient.invalidateQueries({ queryKey: ["departments"] })
         queryClient.invalidateQueries({ queryKey: ["department", department.id] })
      },
   })
}
