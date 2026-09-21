import { Dashboard } from "@/features/dashboard/Dashboard"
import type { AppRoute } from "@/types/routes"
import { GitCompareIcon } from "lucide-react"

export const control = {
   path: "control",
   Component: Dashboard,
   handle: {
      label: "Контроль якості",
      Icon: GitCompareIcon,
      nav: false, // true
   },
} satisfies AppRoute
