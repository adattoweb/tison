import { Dashboard } from "@/features/dashboard/Dashboard"
import { PackageSearch } from "lucide-react"

export const products = {
   path: "products",
   Component: Dashboard,
   handle: {
      label: "Працівники",
      Icon: PackageSearch,
      nav: true,
   },
}
