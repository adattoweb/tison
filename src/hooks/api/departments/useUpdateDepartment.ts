import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateDepartment } from "@/api/endpoints/departments"
import type { DepartmentBaseInput } from "@/api/schemas/department"

export function useUpdateDepartment() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: DepartmentBaseInput }) => updateDepartment(id, payload),
      onSuccess: (_data, variables) => {
         queryClient.invalidateQueries({ queryKey: ["departments"] })
         queryClient.invalidateQueries({ queryKey: ["department", variables.id] })
      },
   })
}
