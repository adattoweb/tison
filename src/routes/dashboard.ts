import { Dashboard } from "@/features/dashboard/Dashboard"
import { LayoutDashboard } from "lucide-react"

export const dashboard = {
   path: "dashboard",
   Component: Dashboard,
   handle: {
      label: "Панель керування",
      Icon: LayoutDashboard,
      nav: true,
   },
}
