import { api } from "@/api/api"
import type { RoleListRead } from "@/api/types/role"

export const getRoles = async (): Promise<RoleListRead[]> => {
   const { data } = await api.get<RoleListRead[]>("/roles/")
   return data
}
