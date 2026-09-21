import { Analytics } from "@/features/analytics/Analytics"
import type { AppRoute } from "@/types/routes"
import { ChartNoAxesCombined } from "lucide-react"

export const analytics = {
   path: "analytics",
   Component: Analytics,
   handle: {
      label: "Аналітика",
      Icon: ChartNoAxesCombined,
      nav: false, // true
   },
} satisfies AppRoute
