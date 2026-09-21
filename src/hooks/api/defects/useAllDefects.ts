import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getAllDefects, type GetDefectsParams } from "@/api/endpoints/defects"

export function useAllDefects(params: GetDefectsParams) {
   return useQuery({
      queryKey: ["defects", params],
      queryFn: () => getAllDefects(params),
      placeholderData: keepPreviousData,
   })
}
