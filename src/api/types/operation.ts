export type OperationStatus = "pending" | "in_progress" | "completed" | "failed" // підженіть під реальний enums.status.Status

export interface OperationListRead {
   id: number
   code: string
   operation_type_id: number
   operator_id: string | null
   product_id: number
   start_at: string | null
   end_at: string | null
   status: OperationStatus
   station_id: number | null
   order: number
}

export interface OperationTypeStats {
   operation_type_id: number
   name: string
   count: number
}