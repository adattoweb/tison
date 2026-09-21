import type { ReactNode } from "react"
import type { Permission } from "@/api/types/permission"
import { usePermissions } from "@/hooks/api/auth/usePermissions"

export function Can({ resource, action, children }: Permission & { children: ReactNode }) {
   const { can } = usePermissions()
   return can({ resource, action }) ? <>{children}</> : null
}
