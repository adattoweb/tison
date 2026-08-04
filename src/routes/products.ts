import { Product } from "@/features/products/product/Product"
import { Products } from "@/features/products/Products"
import { PackageSearch } from "lucide-react"

export const products = {
   path: "products",
   handle: {
      label: "Вироби",
      Icon: PackageSearch,
      nav: true,
   },
   children: [
      {
         index: true,
         Component: Products,
      },
      {
         path: ":id",
         Component: Product,
      },
   ],
}
