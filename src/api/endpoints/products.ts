import { api } from "@/api/api"
import type { PaginatedResponse } from "../types/pagination"
import type { ProductListRead, ProductCreatePayload, ProductUpdatePayload } from "@/api/types/product"
import type { StatusType } from "@/types/status"

export interface GetProductsParams {
   page: number
   pageSize: number
   status?: StatusType
   departmentId?: number
   productModelId?: number
   /** відсоток, 0–100 */
   minProgress?: number
   /** відсоток, 0–100 */
   maxProgress?: number
}

export const getAllProducts = async (params: GetProductsParams): Promise<PaginatedResponse<ProductListRead>> => {
   const { data } = await api.get<PaginatedResponse<ProductListRead>>("/products/", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         status: params.status,
         department_id: params.departmentId,
         product_model_id: params.productModelId,
         min_progress: params.minProgress,
         max_progress: params.maxProgress,
      },
   })
   return data
}

export const getProductById = async (id: number): Promise<ProductListRead> => {
   const { data } = await api.get<ProductListRead>(`/products/${id}`)
   return data
}

export const createProduct = async (payload: ProductCreatePayload): Promise<ProductCreatePayload> => {
   const { data } = await api.post<ProductCreatePayload>("/products/", payload)
   return data
}

export const updateProduct = async (id: number, payload: ProductUpdatePayload): Promise<ProductUpdatePayload> => {
   const { data } = await api.put<ProductUpdatePayload>(`/products/${id}`, payload)
   return data
}

export const deleteProduct = async (id: number): Promise<void> => {
   await api.delete(`/products/${id}`)
}
