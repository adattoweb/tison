import { api } from "@/api/api"
import type { PaginatedResponse } from "../types/pagination"
import type { ProductListRead } from "@/api/types/product"
import type { ProductCreateInput, ProductUpdateInput } from "../schemas/product"
import type { ProductsParams } from "@/types/api"

export const getAllProducts = async (params: ProductsParams): Promise<PaginatedResponse<ProductListRead>> => {
   const { data } = await api.get<PaginatedResponse<ProductListRead>>("/products/", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         status: params.status,
         department_id: params.departmentId,
         product_model_id: params.productModelId,
         min_progress: params.minProgress,
         max_progress: params.maxProgress,
         search: params.search || null,
      },
   })
   return data
}

export const getProductById = async (id: number): Promise<ProductListRead> => {
   const { data } = await api.get<ProductListRead>(`/products/${id}`)
   return data
}

export const createProduct = async (payload: ProductCreateInput): Promise<ProductCreateInput> => {
   const { data } = await api.post<ProductCreateInput>("/products/", payload)
   return data
}

export const updateProduct = async (id: number, payload: ProductUpdateInput): Promise<ProductUpdateInput> => {
   const { data } = await api.put<ProductUpdateInput>(`/products/${id}`, payload)
   return data
}

export const deleteProduct = async (id: number): Promise<void> => {
   await api.delete(`/products/${id}`)
}
