import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllOperationTypes, type GetOperationTypesParams } from "@/api/endpoints/operationTypes"

export function useAllOperationTypes(params: GetOperationTypesParams) {
   return useQuery({
      queryKey: ["operationTypes", params],
      queryFn: () => getAllOperationTypes(params),
      placeholderData: keepPreviousData,
   })
}
