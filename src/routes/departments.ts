import { Departments } from "@/features/departments/Departments"
import type { AppRoute } from "@/types/routes"
import { MonitorCog } from "lucide-react"

export const departments = {
   path: "departments",
   handle: {
      label: "Департаменти",
      Icon: MonitorCog,
      nav: true,
      permission: { resource: "department", action: "read" },
   },
   Component: Departments,
} satisfies AppRoute
