import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateDepartment } from "@/api/endpoints/departments"
import type { DepartmentUpdatePayload } from "@/api/types/department"

export function useUpdateDepartment() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: DepartmentUpdatePayload }) => updateDepartment(id, payload),
      onSuccess: (_data, variables) => {
         queryClient.invalidateQueries({ queryKey: ["departments"] })
         queryClient.invalidateQueries({ queryKey: ["department", variables.id] })
      },
   })
}
