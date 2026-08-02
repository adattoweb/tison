import { Products } from "@/features/products/Products"
import { PackageSearch } from "lucide-react"

export const products = {
   path: "products",
   Component: Products,
   handle: {
      label: "Вироби",
      Icon: PackageSearch,
      nav: true,
   },
}
