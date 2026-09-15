import { Logout } from "@/features/auth/Logout"
import { UserIcon } from "lucide-react"

export const logout = {
   path: "logout",
   handle: {
      label: "Вихід",
      icon: UserIcon,
      nav: false,
   },
   Component: Logout,
}
