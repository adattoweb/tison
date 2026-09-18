import type { StatusType } from "@/types/status"

export interface OperationTypeStats {
   operation_type_id: number
   name: string
   count: number
}

export interface OperationTypeShort {
   id: number
   name: string
   color: string
   points: number
}

export interface StationShort {
   id: number
   code: string
}

export interface ProductShort {
   id: number
   code: string
   order_id: number | null
}

export interface OperationListRead {
   id: number
   code: string
   operation_type_id: number
   operator_id: string | null
   product_id: number
   start_at: string | null
   end_at: string | null
   status: StatusType
   station_id: number | null
   order: number

   operation_type: OperationTypeShort | null
   product: ProductShort | null
   station: StationShort | null

   duration: number | null
}

export interface OperationCreatePayload {
   operation_type_id: number
   product_id: number
   order: number
}

export interface OperationUpdatePayload {
   station_id: number
   start_at?: string | null
   end_at?: string | null
   status: StatusType
}

export interface OperationStartPayload {
   station_id: number
}
