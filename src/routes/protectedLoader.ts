import { redirect } from "react-router"
import { queryClient } from "@/main"
import { currentUserQueryOptions } from "@/hooks/api/auth/useCurrentUser"

export const protectedLoader = async () => {
   try {
      const user = await queryClient.query(currentUserQueryOptions)
      return user
   } catch {
      throw redirect("/login")
   }
}
