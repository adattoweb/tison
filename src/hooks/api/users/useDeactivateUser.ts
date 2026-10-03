import { useMutation } from "@tanstack/react-query"
import { deactivateUser } from "@/api/endpoints/users"
import { queryClient } from "@/main"

export function useDeactivateUser() {
   return useMutation({
      mutationFn: (id: string) => deactivateUser(id as string),
      onSuccess: updated => {
         queryClient.setQueryData(["user_is_active", updated.id], updated)
         queryClient.invalidateQueries({ queryKey: ["user_is_active", updated.id] })
      },
   })
}
