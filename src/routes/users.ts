import { Users } from "@/features/users/Users"
import { UserIcon } from "@heroicons/react/24/outline"

export const users = {
   path: "users",
   Component: Users,
   handle: {
      label: "Працівники",
      Icon: UserIcon,
      nav: true,
   },
}
