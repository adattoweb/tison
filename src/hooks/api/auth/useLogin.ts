import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { login } from "@/api/endpoints/auth"
import type { LoginCredentials } from "@/api/types/auth"

export const useLogin = () => {
   const queryClient = useQueryClient()
   const navigate = useNavigate()

   return useMutation({
      mutationFn: ({ email, password }: LoginCredentials) => login(email, password),
      onSuccess: async () => {
         await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
         navigate("/dashboard")
      },
   })
}
