import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllOperationTypes } from "@/api/endpoints/operationTypes"
import type { ParamsWithActive } from "@/types/api"

export function useAllOperationTypes(params: ParamsWithActive) {
   return useQuery({
      queryKey: ["operationTypes", params],
      queryFn: () => getAllOperationTypes(params),
      placeholderData: keepPreviousData,
   })
}
