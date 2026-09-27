import { api } from "@/api/api"
import type { PermissionListRead } from "@/api/types/permission"

export const getPermissions = async (): Promise<PermissionListRead[]> => {
   const { data } = await api.get<PermissionListRead[]>("/permissions")
   return data
}
