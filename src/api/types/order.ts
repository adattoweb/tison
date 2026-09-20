import type { StatusType } from "@/types/status"
import type { ProductModelListRead } from "./product_model"

export interface OrderListRead {
   id: number
   product_model_id: number

   start_at: string | null
   end_at: string | null
   planned_start_at: string
   planned_end_at: string
   status: StatusType
   plan: number
   fact: number
}

export interface OrderRead extends OrderListRead {
   product_model: ProductModelListRead
}
