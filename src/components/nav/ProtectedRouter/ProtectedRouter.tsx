import { Navigate, Outlet } from "react-router"
import { useCurrentUser } from "@/hooks/auth/useCurrentUser"

export default function ProtectedRoute() {
   const { data: user, isLoading, isError } = useCurrentUser()

   if (isLoading) return <div>Завантаження...</div>
   if (isError || !user) return <Navigate to="/login" replace />

   return <Outlet />
}
