import { Models } from "@/features/models/Models"
import type { AppRoute } from "@/types/routes"
import { PackagePlus } from "lucide-react"

export const models = {
   path: "models",
   Component: Models,
   handle: {
      label: "Моделі продуктів",
      Icon: PackagePlus,
      nav: true,
      permission: { resource: "product_model", action: "read" },
   },
} satisfies AppRoute
