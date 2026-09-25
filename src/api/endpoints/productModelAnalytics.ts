import { api } from "@/api/api"
import type { ProductModelsOverview } from "../types/productModelAnalytics"

export const getProductModelsOverview = async (): Promise<ProductModelsOverview> => {
   const { data } = await api.get<ProductModelsOverview>("/analytics/product-models/overview")
   return data
}
