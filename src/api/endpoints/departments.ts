import { api } from "@/api/api"
import type { DepartmentRead } from "../types/department"
import type { PaginatedResponse } from "../types/pagination"
import type { PaginationParams } from "@/types/api"

export const getAllDepartments = async (params: PaginationParams): Promise<PaginatedResponse<DepartmentRead>> => {
   const { data } = await api.get<PaginatedResponse<DepartmentRead>>("/departments", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         search: params.search || undefined,
      },
   })
   return data
}
