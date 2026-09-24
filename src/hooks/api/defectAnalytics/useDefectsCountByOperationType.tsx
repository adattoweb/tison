import { useQuery } from "@tanstack/react-query"
import {
   getDefectsCountByOperationType,
   type GetDefectsCountByOperationTypeParams,
} from "@/api/endpoints/defectAnalytics"

export function useDefectsCountByOperationType(
   operationTypeId: number,
   params: GetDefectsCountByOperationTypeParams = {},
) {
   return useQuery({
      queryKey: ["defectsCountByOperationType", operationTypeId, params],
      queryFn: () => getDefectsCountByOperationType(operationTypeId, params),
      enabled: Number.isFinite(operationTypeId),
   })
}
