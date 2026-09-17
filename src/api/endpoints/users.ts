import { api } from "@/api/api"
import type { AdminUserCreateInput } from "../schemas/admin"
import type { AdminUserCreateResponse } from "@/api/types/admin"

export const createUser = async (data: AdminUserCreateInput): Promise<AdminUserCreateResponse> => {
   const { data: response } = await api.post<AdminUserCreateResponse>("/admin/users/create", data)
   return response
}
