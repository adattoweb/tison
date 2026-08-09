import { Dashboard } from "@/features/dashboard/Dashboard"
import { WarehouseIcon } from "lucide-react"

export const storage = {
   path: "storage",
   Component: Dashboard,
   handle: {
      label: "Склад",
      Icon: WarehouseIcon,
      nav: true,
   },
}
