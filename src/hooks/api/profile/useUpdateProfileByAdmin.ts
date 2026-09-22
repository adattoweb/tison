import { useMutation, useQueryClient } from "@tanstack/react-query"

import { updateProfileByAdmin } from "@/api/endpoints/profiles"
import type { ProfileAdminUpdateInput } from "@/api/schemas/profile"

interface UpdateProfileByAdminParams {
   profileId: number
   data: ProfileAdminUpdateInput
   userId?: string
}

export function useUpdateProfileByAdmin() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ profileId, data }: UpdateProfileByAdminParams) => updateProfileByAdmin(profileId, data),
      onSuccess: (updated, variables) => {
         if (variables.userId) {
            queryClient.setQueryData(["profile", variables.userId], updated)
         }
         queryClient.invalidateQueries({ queryKey: ["profiles"] })
      },
   })
}
