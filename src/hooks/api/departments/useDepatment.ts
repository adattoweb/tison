import { useQuery } from "@tanstack/react-query"
import { getDepartmentById } from "@/api/endpoints/departments"

export const useDepartment = (id: number) => {
   return useQuery({
      queryKey: ["department", id],
      queryFn: () => getDepartmentById(id),
   })
}
