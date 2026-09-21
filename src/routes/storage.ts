import { Storage } from "@/features/storage/Storage"
import type { AppRoute } from "@/types/routes"
import { WarehouseIcon } from "lucide-react"

export const storage = {
   path: "storage",
   Component: Storage,
   handle: {
      label: "Склад",
      Icon: WarehouseIcon,
      nav: false, // true
   },
} satisfies AppRoute
