import { logout } from "@/api/endpoints/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

// hooks/api/auth/useLogout.ts
export function useLogout() {
   const queryClient = useQueryClient()
   const navigate = useNavigate()

   return useMutation({
      mutationFn: logout,
      onSettled: () => {
         navigate("/login", { replace: true })
         queryClient.clear()
      },
   })
}
