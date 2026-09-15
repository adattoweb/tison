// hooks/api/profile/useCurrentProfile.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/api/api"

export function useCurrentProfile() {
   return useQuery({
      queryKey: ["profile", "current"],
      queryFn: async () => {
         const { data } = await api.get("/profile")
         return data
      },
      retry: false, // не повторювати запит при помилці
      refetchOnWindowFocus: false, // не рефетчити при поверненні на вкладку
      refetchOnReconnect: true, // не рефетчити при відновленні зʼєднання
      refetchOnMount: true, // не рефетчити повторно при ремаунті компонента
      staleTime: 60 * 1000, // дані ніколи не вважаються застарілими → не тригерить рефетч
   })
}
