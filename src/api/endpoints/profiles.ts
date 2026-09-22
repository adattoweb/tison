import { api } from "@/api/api"
import type { ProfileRead } from "../types/profile"
import type { PaginatedResponse } from "@/api/types/pagination"
import type { ParamsWithShift } from "@/types/api"
import type { ProfileUpdateInput, ProfileAdminUpdateInput } from "@/api/schemas/profile"
import type { OperationListRead, OperationTypeStats } from "@/api/types/operation"

export const getCurrentProfile = async (): Promise<ProfileRead> => {
   const { data } = await api.get<ProfileRead>("/profile/")
   return data
}

export const getAllProfiles = async (params: ParamsWithShift): Promise<PaginatedResponse<ProfileRead>> => {
   const { data } = await api.get<PaginatedResponse<ProfileRead>>("/profiles", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         search: params.search || undefined,
         shift_id: params.shiftId || undefined,
      },
   })
   return data
}

export const getProfileByUserId = async (userId: string): Promise<ProfileRead> => {
   const { data } = await api.get<ProfileRead>(`/profile/${userId}`)
   return data
}

export const getMyProfile = async (): Promise<ProfileRead> => {
   const { data } = await api.get<ProfileRead>("/profile")
   return data
}

export const updateMyProfile = async (data: ProfileUpdateInput): Promise<ProfileRead> => {
   const { data: response } = await api.put<ProfileRead>("/profile", data)
   return response
}

export const updateProfileByAdmin = async (profileId: number, data: ProfileAdminUpdateInput): Promise<ProfileRead> => {
   const { data: response } = await api.put<ProfileRead>(`/profile/${profileId}`, data)
   return response
}

export const getProfileOperations = async (userId: string, limit = 10): Promise<OperationListRead[]> => {
   const { data } = await api.get<OperationListRead[]>(`/profile/${userId}/operations`, {
      params: { limit },
   })
   return data
}

export const getProfileOperationStats = async (userId: string): Promise<OperationTypeStats[]> => {
   const { data } = await api.get<OperationTypeStats[]>(`/profile/${userId}/operations/stats`)
   return data
}
