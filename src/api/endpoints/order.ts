import { api } from "@/api/api"
import type { OrderListRead } from "../types/order"
import type { PaginatedResponse } from "../types/pagination"
import type { OrderCreateInput, OrderUpdateInput } from "../schemas/order"
import type { OrdersParams } from "@/types/api"

export const getAllOrders = async (params: OrdersParams): Promise<PaginatedResponse<OrderListRead>> => {
   const { data } = await api.get<PaginatedResponse<OrderListRead>>("/orders", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         status: params.status,
         product_model_id: params.productModelId,
         start_from: params.startFrom,
         start_to: params.startTo,
         end_from: params.endFrom,
         end_to: params.endTo,
      },
   })
   return data
}

export const getOrderById = async (id: number): Promise<OrderListRead> => {
   const { data } = await api.get<OrderListRead>(`/orders/${id}`)
   return data
}

export const createOrder = async (data: OrderCreateInput): Promise<OrderCreateInput> => {
   const { data: response } = await api.post<OrderCreateInput>("/orders", data)
   return response
}

export const updateOrder = async (id: number, data: OrderUpdateInput): Promise<OrderUpdateInput> => {
   const { data: response } = await api.put<OrderUpdateInput>(`/orders/${id}`, data)
   return response
}

export const deleteOrder = async (id: number): Promise<OrderListRead> => {
   const { data: response } = await api.delete<OrderListRead>(`/orders/${id}`)
   return response
}
