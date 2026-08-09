import { Scheduling } from "@/features/scheduling/Scheduling"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"

export const scheduling = {
   path: "scheduling",
   Component: Scheduling,
   handle: {
      label: "Планування",
      Icon: CalendarDaysIcon,
      nav: true,
   },
}
