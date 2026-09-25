import { api } from "@/api/api"
import type { OperationsOverview } from "../types/operationAnalytics"

export const getOperationsOverview = async (): Promise<OperationsOverview> => {
   const { data } = await api.get<OperationsOverview>("/analytics/operations/overview")
   return data
}
