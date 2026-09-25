import { api } from "@/api/api"
import type { DashboardOverview } from "../types/dashboardAnalytics"

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
   const { data } = await api.get<DashboardOverview>("/analytics/dashboard/overview")
   return data
}
