import { useQueries } from "@tanstack/react-query"
import type { ProfileRead } from "@/api/types/profile"
import { getProfileByUserId } from "@/api/endpoints/profiles"

export const useProfilesByIds = (ids: string[]) =>
   useQueries({
      queries: ids.map(id => ({
         queryKey: ["profile", id], // <- той самий ключ, що в useProfileById
         queryFn: () => getProfileByUserId(id),
         staleTime: 5 * 60 * 1000,
      })),
      combine: results => ({
         profiles: results.map(r => r.data).filter((p): p is ProfileRead => !!p),
         isLoading: results.some(r => r.isLoading),
      }),
   })
