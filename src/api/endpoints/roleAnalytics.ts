import { api } from "@/api/api"
import type { RoleUserCount } from "@/api/types/roleAnalytics"

export const getRoleUserCounts = async (): Promise<RoleUserCount[]> => {
   const { data } = await api.get<RoleUserCount[]>("/analytics/roles/user-counts")
   return data
}
