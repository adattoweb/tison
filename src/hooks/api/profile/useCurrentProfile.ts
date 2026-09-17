import { useQuery } from "@tanstack/react-query"
import { getCurrentProfile } from "@/api/endpoints/profiles"

export function useCurrentProfile() {
   return useQuery({
      queryKey: ["profile", "current"],
      queryFn: getCurrentProfile,
      retry: false, // повторювати запит при помилці
      refetchOnWindowFocus: false, // рефетчити при поверненні на вкладку
      refetchOnReconnect: true, // рефетчити при відновленні зʼєднання
      refetchOnMount: true, // рефетчити повторно при ремаунті компонента
      staleTime: 60 * 1000,
   })
}
