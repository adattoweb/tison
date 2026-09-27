import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteRole } from "@/api/endpoints/roles"

export function useDeleteRole() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: deleteRole,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
   })
}
