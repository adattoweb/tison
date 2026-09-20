import type { StatusType } from "./status"

export interface PaginationParams {
   page: number
   pageSize: number
   search?: string
}

export interface ParamsWithShift extends PaginationParams {
   shiftId?: number
}

export interface OrdersParams {
   page: number
   pageSize: number
   status?: StatusType
   productModelId?: number

   startFrom?: string
   startTo?: string
   endFrom?: string
   endTo?: string
}

export interface ParamsWithActive extends PaginationParams {
   isActive: boolean
}
