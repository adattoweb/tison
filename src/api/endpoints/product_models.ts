import { api } from "@/api/api"
import type { ProductModelListRead } from "../types/product_model"
import type { PaginatedResponse } from "../types/pagination"
import type { PaginationParams } from "@/types/api"
import type { ProductBaseInput } from "../schemas/product_model"

export const getAllProductModels = async (
   params: PaginationParams,
): Promise<PaginatedResponse<ProductModelListRead>> => {
   const { data } = await api.get<PaginatedResponse<ProductModelListRead>>("/models", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         search: params.search || undefined,
      },
   })
   return data
}

export const getProductModelById = async (id: number): Promise<ProductModelListRead> => {
   const { data } = await api.get<ProductModelListRead>(`/models/${id}`)
   return data
}

export const createProductModel = async (data: ProductBaseInput): Promise<ProductBaseInput> => {
   const { data: response } = await api.post<ProductBaseInput>("/models", data)
   return response
}

export const updateProductModel = async (id: number, data: ProductBaseInput): Promise<ProductBaseInput> => {
   const { data: response } = await api.put<ProductBaseInput>(`/models/${id}`, data)
   return response
}

export const deleteProductModel = async (id: number): Promise<ProductModelListRead> => {
   const { data: response } = await api.delete<ProductModelListRead>(`/models/${id}`)
   return response
}
