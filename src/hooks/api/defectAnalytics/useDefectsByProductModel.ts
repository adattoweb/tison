import { useQuery } from "@tanstack/react-query"
import { getDefectsByProductModel, type DefectsDateRangeParams } from "@/api/endpoints/defectAnalytics"

export function useDefectsByProductModel(productModelId: number, params: DefectsDateRangeParams = {}) {
   return useQuery({
      queryKey: ["defectsByProductModel", productModelId, params],
      queryFn: () => getDefectsByProductModel(productModelId, params),
      enabled: Number.isFinite(productModelId),
   })
}
