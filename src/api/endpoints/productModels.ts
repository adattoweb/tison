import { api } from "@/api/api"
import type { ProductModelListRead, ProductModelRead } from "../types/product_model"
import type { PaginatedResponse } from "../types/pagination"
import type { ParamsWithActive } from "@/types/api"
import type { ProductModelBaseInput } from "../schemas/productModel"

export const getAllProductModels = async (
   params: ParamsWithActive,
): Promise<PaginatedResponse<ProductModelListRead>> => {
   const { data } = await api.get<PaginatedResponse<ProductModelListRead>>("/models", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         search: params.search || undefined,
         isActive: params.isActive,
      },
   })
   return data
}

export const getProductModelById = async (id: number): Promise<ProductModelRead> => {
   const { data } = await api.get<ProductModelRead>(`/models/${id}`)
   return data
}

export const createProductModel = async (data: ProductModelBaseInput): Promise<ProductModelBaseInput> => {
   const { data: response } = await api.post<ProductModelBaseInput>("/models", data)
   return response
}

export const updateProductModel = async (id: number, data: ProductModelBaseInput): Promise<ProductModelBaseInput> => {
   const { data: response } = await api.put<ProductModelBaseInput>(`/models/${id}`, data)
   return response
}

export const deleteProductModel = async (id: number): Promise<ProductModelListRead> => {
   const { data: response } = await api.delete<ProductModelListRead>(`/models/${id}`)
   return response
}
