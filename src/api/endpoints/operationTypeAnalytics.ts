import { api } from "@/api/api"
import type { OperationTypesOverview } from "../types/operationTypeAnalytics"

export const getOperationTypesOverview = async (): Promise<OperationTypesOverview> => {
   const { data } = await api.get<OperationTypesOverview>("/analytics/operation-types/overview")
   return data
}
