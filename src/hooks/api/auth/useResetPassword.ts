import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { resetPassword } from "@/api/endpoints/auth"

export function useResetPassword() {
   const navigate = useNavigate()

   return useMutation({
      mutationFn: ({ token, password }: { token: string; password: string }) => resetPassword(token, password),
      onSuccess: () => {
         navigate("/login", { replace: true })
      },
   })
}
