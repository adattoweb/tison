import { Navigate, useLocation } from "react-router"
import type { ReactNode } from "react"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import { usePermissions } from "@/hooks/api/auth/usePermissions"
import type { PermissionRead } from "@/api/types/permission"

interface Props {
   permission?: PermissionRead
   children: ReactNode
}

export function RequirePermission({ permission, children }: Props) {
   const { isLoading, isAuthenticated, can } = usePermissions()
   const location = useLocation()

   // Поки користувач завантажується, не редіректимо, інакше кожне оновлення сторінки давало б 403
   if (isLoading) return <p className="py-8 text-center text-(--second-color)">Завантаження...</p>

   // 401: не залогінений
   if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />

   // 403: залогінений, але прав немає
   if (!can(permission)) return <ErrorPage />

   return <>{children}</>
}
