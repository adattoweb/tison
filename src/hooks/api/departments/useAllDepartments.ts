import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getAllDepartments } from "@/api/endpoints/departments"
import type { ParamsWithShift } from "@/types/api"

export const useAllDepartments = (params: ParamsWithShift) => {
   return useQuery({
      queryKey: ["departments", params],
      queryFn: () => getAllDepartments(params),
      placeholderData: keepPreviousData,
   })
}
