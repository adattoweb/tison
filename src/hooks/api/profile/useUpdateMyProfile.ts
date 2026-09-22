import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateMyProfile } from "@/api/endpoints/profiles"
import type { ProfileUpdateInput } from "@/api/schemas/profile"

export function useUpdateMyProfile() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (data: ProfileUpdateInput) => updateMyProfile(data),
      onSuccess: updated => {
         queryClient.setQueryData(["profile", "me"], updated)
      },
   })
}
