import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllOperations, type GetOperationsParams } from "@/api/endpoints/operations"

export function useAllOperations(params: GetOperationsParams) {
   return useQuery({
      queryKey: ["operations", params],
      queryFn: () => getAllOperations(params),
      placeholderData: keepPreviousData,
   })
}
