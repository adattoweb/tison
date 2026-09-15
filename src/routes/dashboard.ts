import ProtectedRoute from "@/components/nav/ProtectedRouter/ProtectedRouter"
import { Dashboard } from "@/features/dashboard/Dashboard"
import { LayoutDashboard } from "lucide-react"

export const dashboard = {
   path: "dashboard",
   Element: ProtectedRoute,
   Component: Dashboard,
   handle: {
      label: "Панель керування",
      Icon: LayoutDashboard,
      nav: true,
   },
}
