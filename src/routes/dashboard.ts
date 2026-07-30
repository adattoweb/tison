import DashboardLayout from "@/features/dashboard/DashboardLayout"
import { LayoutDashboard } from "lucide-react"

export const dashboard = {
   path: "dashboard",
   Component: DashboardLayout,
   handle: {
      label: "Панель керування",
      Icon: LayoutDashboard,
      nav: true,
   },
}
