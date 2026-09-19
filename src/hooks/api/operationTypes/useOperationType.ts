import { useQuery } from "@tanstack/react-query"
import { getOperationTypeById } from "@/api/endpoints/operationTypes"

export const useOperationType = (id: number) => {
   return useQuery({
      queryKey: ["operationType", id],
      queryFn: () => getOperationTypeById(id),
   })
}
