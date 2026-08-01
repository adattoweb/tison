import { Dashboard } from "@/features/dashboard/Dashboard"
import { PackageSearch } from "lucide-react"

export const products = {
   path: "products",
   Component: Dashboard,
   handle: {
      label: "Вироби",
      Icon: PackageSearch,
      nav: true,
   },
}
