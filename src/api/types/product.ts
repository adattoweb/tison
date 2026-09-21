import type { StatusType } from "@/types/status"

export interface ProductListRead {
   id: number
   code: string
   current_operation_id: number | null
   product_model_id: number
   steps: number
   start_at: string | null
   end_at: string | null
   status: StatusType
   operator_id: string
   order_id: number | null
   parent_id: number | null

   /** order поточної операції — скільки кроків уже пройдено */
   current_step: number | null
   /** відсоток виконання, 0–100 */
   progress: number
}
