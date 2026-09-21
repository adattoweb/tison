import type { Permission } from "@/api/types/permission"
import type { LucideIcon } from "lucide-react"
import type { RouteObject } from "react-router"

export interface RouteHandle {
   label: string
   Icon: LucideIcon
   nav: boolean
   permission?: Permission
}

export type AppRoute = Omit<RouteObject, "handle"> & {
   handle?: RouteHandle
}
