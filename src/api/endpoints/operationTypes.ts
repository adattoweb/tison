import { api } from "@/api/api"
import type { PaginatedResponse } from "@/api/types/pagination"
import type {
   OperationTypeRead,
   OperationTypeCreatePayload,
   OperationTypeUpdatePayload,
} from "@/api/types/operationType"
import type { ParamsWithActive } from "@/types/api"

export const getAllOperationTypes = async (params: ParamsWithActive): Promise<PaginatedResponse<OperationTypeRead>> => {
   const { data } = await api.get<PaginatedResponse<OperationTypeRead>>("/operation_types/", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         is_active: params.isActive,
         search: params.search,
      },
   })
   return data
}

export const getOperationTypeById = async (id: number): Promise<OperationTypeRead> => {
   const { data } = await api.get<OperationTypeRead>(`/operation_types/${id}`)
   return data
}

export const createOperationType = async (payload: OperationTypeCreatePayload): Promise<OperationTypeRead> => {
   const { data } = await api.post<OperationTypeRead>("/operation_types/", payload)
   return data
}

export const updateOperationType = async (
   id: number,
   payload: OperationTypeUpdatePayload,
): Promise<OperationTypeRead> => {
   const { data } = await api.put<OperationTypeRead>(`/operation_types/${id}`, payload)
   return data
}

export const dearchiveOperationType = async (id: number): Promise<void> => {
   await api.patch(`/operation_types/${id}`)
}

export const deleteOperationType = async (id: number): Promise<void> => {
   await api.delete(`/operation_types/${id}`)
}
