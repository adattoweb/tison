import { useMutation } from "@tanstack/react-query"
import { activateUser } from "@/api/endpoints/users"
import { queryClient } from "@/main"

export function useActivateUser() {
   return useMutation({
      mutationFn: (id: string) => activateUser(id as string),
      onSuccess: updated => {
         queryClient.setQueryData(["user_is_active", updated.id], updated)
         queryClient.invalidateQueries({ queryKey: ["user_is_active", updated.id] })
      },
   })
}
