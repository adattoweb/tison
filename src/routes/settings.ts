import { Dashboard } from "@/features/dashboard/Dashboard"
import { Cog6ToothIcon } from "@heroicons/react/24/outline"

export const settings = {
   path: "settings",
   Component: Dashboard,
   handle: {
      label: "Налаштування",
      Icon: Cog6ToothIcon,
      nav: true,
   },
}
