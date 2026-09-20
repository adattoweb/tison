import { Orders } from "@/features/orders/Orders"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"

export const orders = {
   path: "orders",
   Component: Orders,
   handle: {
      label: "Планування",
      Icon: CalendarDaysIcon,
      nav: true,
   },
}
