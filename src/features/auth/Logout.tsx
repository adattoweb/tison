import { useLogout } from "@/hooks/auth/useLogout"

export function Logout() {
   const { mutate: doLogout } = useLogout()
   doLogout()
   return <div className=""></div>
}
