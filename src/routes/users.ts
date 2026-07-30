import DashboardLayout from "@/features/dashboard/DashboardLayout"
import { UserIcon } from "@heroicons/react/24/outline"

export const users = {
   path: "users",
   Component: DashboardLayout,
   handle: {
      label: "Працівники",
      Icon: UserIcon,
      nav: true,
   },
}
