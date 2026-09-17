import { useLogout } from "@/hooks/api/auth/useLogout"
import { useEffect } from "react"

export function Logout() {
   const { mutate: doLogout } = useLogout()
   useEffect(() => {
      doLogout()
   }, [doLogout])
   return <div className=""></div>
}
