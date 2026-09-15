import { useLogout } from "@/hooks/api/auth/useLogout"

export function Logout() {
   const { mutate: doLogout } = useLogout()
   doLogout()
   return <div className=""></div>
}
