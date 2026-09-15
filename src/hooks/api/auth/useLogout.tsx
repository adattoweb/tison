import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { logout } from "@/api/endpoints/auth"

export const useLogout = () => {
   const queryClient = useQueryClient()
   const navigate = useNavigate()

   return useMutation({
      mutationFn: () => logout(),
      onSuccess: () => {
         queryClient.setQueryData(["currentUser"], null)
         navigate("/login")
      },
   })
}
