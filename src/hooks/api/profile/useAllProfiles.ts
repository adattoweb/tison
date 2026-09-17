import { useQuery } from "@tanstack/react-query"
import { getAllProfiles } from "@/api/endpoints/profile"

export function useAllProfiles() {
   return useQuery({
      queryKey: ["profiles"],
      queryFn: getAllProfiles,
      retry: false, // повторювати запит при помилці
      refetchOnWindowFocus: false, // рефетчити при поверненні на вкладку
      refetchOnReconnect: true, // рефетчити при відновленні зʼєднання
      refetchOnMount: true, // рефетчити повторно при ремаунті компонента
      staleTime: 60 * 1000,
   })
}
