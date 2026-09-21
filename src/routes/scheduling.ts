import { Orders } from "@/features/orders/Orders"
import type { AppRoute } from "@/types/routes"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"

export const orders = {
   path: "orders",
   Component: Orders,
   handle: {
      label: "Планування",
      Icon: CalendarDaysIcon,
      nav: true,
      permission: { resource: "scheduling", action: "read" },
   },
} satisfies AppRoute
