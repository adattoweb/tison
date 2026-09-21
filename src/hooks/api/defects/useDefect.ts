import { useQuery } from "@tanstack/react-query"
import { getDefectById } from "@/api/endpoints/defects"

export function useDefect(id?: number) {
   return useQuery({
      queryKey: ["defect", id],
      queryFn: () => getDefectById(id as number),
      enabled: id !== undefined,
   })
}
