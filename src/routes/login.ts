import { Login } from "@/features/auth/Login"
import { UserIcon } from "lucide-react"

export const login = {
   path: "login",
   handle: {
      label: "Авторизація",
      icon: UserIcon,
      nav: false,
   },
   Component: Login,
}
