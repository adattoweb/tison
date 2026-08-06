import { Analytics } from "@/features/analytics/Analytics"
import { ChartNoAxesCombined } from "lucide-react"

export const analytics = {
   path: "analytics",
   Component: Analytics,
   handle: {
      label: "Аналітика",
      Icon: ChartNoAxesCombined,
      nav: true,
   },
}
