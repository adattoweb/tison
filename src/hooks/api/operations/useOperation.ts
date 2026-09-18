import { useQuery } from "@tanstack/react-query"
import { getOperationById } from "@/api/endpoints/operations"

export function useOperation(id?: number) {
   return useQuery({
      queryKey: ["operation", id],
      queryFn: () => getOperationById(id as number),
      enabled: id !== undefined,
   })
}
