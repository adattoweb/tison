import { api } from "@/api/api"
import type { DepartmentRead } from "../types/department"
import type { PaginatedResponse } from "../types/pagination"
import type { PaginationParams } from "@/types/api"
import type { DepartmentBaseInput } from "../schemas/department"

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

export const getDepartmentById = async (id: number): Promise<DepartmentRead> => {
   const { data } = await api.get<DepartmentRead>(`/departments/${id}`)
   return data
}

export const createDepartment = async (data: DepartmentBaseInput): Promise<DepartmentBaseInput> => {
   const { data: response } = await api.post<DepartmentBaseInput>("/departments", data)
   return response
}

export const updateDepartment = async (id: number, data: DepartmentBaseInput): Promise<DepartmentBaseInput> => {
   const { data: response } = await api.put<DepartmentBaseInput>(`/departments/${id}`, data)
   return response
}
