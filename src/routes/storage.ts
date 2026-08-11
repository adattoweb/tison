import { Storage } from "@/features/storage/Storage"
import { WarehouseIcon } from "lucide-react"

export const storage = {
   path: "storage",
   Component: Storage,
   handle: {
      label: "Склад",
      Icon: WarehouseIcon,
      nav: true,
   },
}
