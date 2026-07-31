import { Dashboard } from "@/features/dashboard/Dashboard"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"

export const scheduling = {
   path: "scheduling",
   Component: Dashboard,
   handle: {
      label: "Планування",
      Icon: CalendarDaysIcon,
      nav: true,
   },
}
