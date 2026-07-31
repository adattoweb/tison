import { Dashboard } from "@/features/dashboard/Dashboard"
import { MonitorCog } from "lucide-react"

export const stations = {
   path: "stations",
   Component: Dashboard,
   handle: {
      label: "Робочі станції",
      Icon: MonitorCog,
      nav: true,
   },
}
