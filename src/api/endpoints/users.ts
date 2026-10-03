import { api } from "@/api/api"
import type { AdminUserCreateInput } from "../schemas/admin"
import type { AdminUserCreateResponse } from "@/api/types/admin"
import type { UserIsActiveRead, UserIsSuperUserRead, UserRead } from "../types/auth"

export const createUser = async (data: AdminUserCreateInput): Promise<AdminUserCreateResponse> => {
   const { data: response } = await api.post<AdminUserCreateResponse>("/admin/users/create", data)
   return response
}

export const deactivateUser = async (id: string): Promise<UserRead> => {
   const { data: response } = await api.patch(`/users/${id}/deactivate`)
   return response
}

export const activateUser = async (id: string): Promise<UserRead> => {
   const { data: response } = await api.patch(`/users/${id}/activate`)
   return response
}

export const getUser = async (id: string): Promise<UserRead> => {
   const { data: response } = await api.get(`/users/${id}`)
   return response
}
export const getIsUserActive = async (id: string): Promise<UserIsActiveRead> => {
   const { data: response } = await api.get(`/users/activity/${id}`)
   return response
}

export const getIsSuperUser = async (id: string): Promise<UserIsSuperUserRead> => {
   const { data: response } = await api.get(`/users/superuser/${id}`)
   return response
}
