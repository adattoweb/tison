import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createRolePermission } from "@/api/endpoints/rolePermissions"

export function useCreateRolePermission() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: createRolePermission,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
   })
}
