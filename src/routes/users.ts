import { Dashboard } from "@/features/dashboard/Dashboard"
import { UserIcon } from "@heroicons/react/24/outline"

export const users = {
   path: "users",
   Component: Dashboard,
   handle: {
      label: "Працівники",
      Icon: UserIcon,
      nav: true,
   },
}
