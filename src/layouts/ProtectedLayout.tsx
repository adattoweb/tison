import { Navigate, Outlet, useLocation, useMatches } from "react-router"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import { usePermissions } from "@/hooks/api/auth/usePermissions"
import type { RouteHandle } from "@/types/routes"
import { AppShell } from "./AppLayout"

export function ProtectedLayout() {
   const { isLoading, isAuthenticated, can } = usePermissions()
   const matches = useMatches()
   const location = useLocation()

   // Поки користувач завантажується, не редіректимо, інакше кожне оновлення сторінки давало б 403
   if (isLoading) return <p className="py-8 text-center text-(--second-color)">Завантаження...</p>

   if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />

   // Потрібні права всіх роутів у ланцюжку
   const allowed = matches.every(match => can((match.handle as Partial<RouteHandle> | undefined)?.permission))
   if (!allowed) return <ErrorPage />

   return (
      <>
         <AppShell withSidebar={true}>
            <Outlet />
         </AppShell>
      </>
   )
}
