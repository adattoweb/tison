import { api } from "@/api/api"
import type { ProfileRead } from "@/api/types/profile"
import type { PaginatedResponse } from "@/api/types/pagination"
import type { ProfileParams } from "@/types/api"

export const getCurrentProfile = async (): Promise<ProfileRead> => {
   const { data } = await api.get<ProfileRead>("/profile/")
   return data
}

export const getAllProfiles = async (params: ProfileParams): Promise<PaginatedResponse<ProfileRead>> => {
   const { data } = await api.get<PaginatedResponse<ProfileRead>>("/profiles", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         search: params.search || undefined,
         shift_id: params.shiftId,
      },
   })
   return data
}

export const getProfileByUserId = async (userId: string): Promise<ProfileRead> => {
   const { data } = await api.get<ProfileRead>(`/profile/${userId}`)
   return data
}
