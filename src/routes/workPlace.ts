import { WorkPlace } from "@/features/workPlace/WorkPlace"
import type { AppRoute } from "@/types/routes"
import { MonitorCog } from "lucide-react"

export const workPlace = {
   path: "workplace",
   Component: WorkPlace,
   handle: {
      label: "Робоче місце",
      Icon: MonitorCog,
      nav: true,
      permission: { resource: "session", action: "create" },
   },
} satisfies AppRoute
