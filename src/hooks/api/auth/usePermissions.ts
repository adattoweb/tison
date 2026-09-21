import { useMemo } from "react"
import { useMe } from "@/hooks/api/auth/useMe"
import type { Permission } from "@/api/types/permission"

export function usePermissions() {
   const { data: me, isLoading } = useMe()

   // Set зі строк "resource:action" для миттєвого пошуку
   const granted = useMemo(() => new Set((me?.permissions ?? []).map(p => `${p.resource}:${p.action}`)), [me])

   // Без permission доступ мають усі залогінені, суперкористувач бачить усе
   const can = (permission?: Permission) =>
      !permission || !!me?.is_superuser || granted.has(`${permission.resource}:${permission.action}`)

   return { me, isLoading, isAuthenticated: !!me, can }
}
