import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteRolePermission } from "@/api/endpoints/rolePermissions"

export function useDeleteRolePermission() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: deleteRolePermission,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
   })
}
