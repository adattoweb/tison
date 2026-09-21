import { Dashboard } from "@/features/dashboard/Dashboard"
import type { AppRoute } from "@/types/routes"
import { CpuChipIcon } from "@heroicons/react/24/outline"

export const analysis = {
   path: "analysis",
   Component: Dashboard,
   handle: {
      label: "ШІ Аналіз",
      Icon: CpuChipIcon,
      nav: false, // true
      permission: { resource: "order", action: "read" },
   },
} satisfies AppRoute
