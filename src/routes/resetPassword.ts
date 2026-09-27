import { ResetPassword } from "@/features/auth/ResetPassword"
import { UserIcon } from "lucide-react"

export const resetPassword = {
   path: "reset-password",
   handle: {
      label: "Скидання паролю",
      icon: UserIcon,
      nav: false,
   },
   Component: ResetPassword,
}
