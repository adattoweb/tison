import { api } from "@/api/api"
import type { RolePermissionListRead } from "@/api/types/role"

export interface RolePermissionPayload {
   role_id: number
   permission_id: number
}

export const createRolePermission = async (payload: RolePermissionPayload): Promise<RolePermissionListRead> => {
   const { data } = await api.post<RolePermissionListRead>("/role_permissions", payload)
   return data
}

export const deleteRolePermission = async (payload: RolePermissionPayload): Promise<void> => {
   await api.delete("/role_permissions", { params: payload })
}
