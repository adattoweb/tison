import { useQuery } from "@tanstack/react-query"
import { getDefectsByOperationType, type GetDefectsByOperationTypeParams } from "@/api/endpoints/defectAnalytics"

export function useDefectsByOperationType(params: GetDefectsByOperationTypeParams) {
   return useQuery({
      queryKey: ["defectsByOperationType", params],
      queryFn: () => getDefectsByOperationType(params),
   })
}
