import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getAllDepartments } from "@/api/endpoints/departments"

interface UseAllDepartmentsParams {
   page: number
   pageSize: number
   search?: string
   shiftId?: number
}

export const useAllDepartments = (params: UseAllDepartmentsParams) => {
   return useQuery({
      queryKey: ["departments", params],
      queryFn: () => getAllDepartments(params),
      placeholderData: keepPreviousData,
   })
}
