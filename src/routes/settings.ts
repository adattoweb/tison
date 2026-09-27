import { Settings } from "@/features/settings/Settings"
import type { AppRoute } from "@/types/routes"
import { Cog6ToothIcon } from "@heroicons/react/24/outline"

export const settings = {
   path: "settings",
   Component: Settings,
   handle: {
      label: "Налаштування",
      Icon: Cog6ToothIcon,
      nav: true,
      permission: { resource: "role", action: "read" },
   },
} satisfies AppRoute
