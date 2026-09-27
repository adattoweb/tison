import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateRole } from "@/api/endpoints/roles"
import type { RoleFormInput } from "@/api/schemas/role"

export function useUpdateRole() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: RoleFormInput }) => updateRole(id, payload),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
   })
}
