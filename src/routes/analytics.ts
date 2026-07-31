import { Dashboard } from "@/features/dashboard/Dashboard"
import { ChartNoAxesCombined } from "lucide-react"

export const analytics = {
   path: "analytics",
   Component: Dashboard,
   handle: {
      label: "Аналітика",
      Icon: ChartNoAxesCombined,
      nav: true,
   },
}
