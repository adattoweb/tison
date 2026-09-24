export interface ProductionAnalyticsPoint {
   date: string // "YYYY-MM-DD"
   planned: number
   fact: number
   is_deadline: boolean
}

export interface ProductModelSummary {
   product_model_id: number
   product_model_title: string
   planned: number
   fact: number
   remaining: number
}

export interface ProductionDayPoint {
   date: string // "YYYY-MM-DD"
   by_model: ProductModelSummary[]
   total_planned: number
   total_fact: number
   total_remaining: number
}

export interface ProductionSummary {
   today: ProductionDayPoint
   upcoming: ProductionDayPoint[]
}

export type ProductHistoryEventType =
   | "operation_created"
   | "operation_started"
   | "session_started"
   | "session_ended"
   | "operation_ended"
   | "defect_opened"
   | "defect_closed"

export type SessionResult = "paused" | "completed" | "cancelled"

export interface OperatorShortRead {
   id: string
   first_name: string
   last_name: string
   position: string | null
}

export interface ProductHistoryEvent {
   type: ProductHistoryEventType
   at: string // ISO datetime

   operation_id: number
   operation_code: string
   operation_type_id: number
   operation_type_name: string
   order: number

   work_session_id: string | null
   station_id: number | null
   station_code: string | null
   result: SessionResult | null

   defect_id: number | null
   defect_code: string | null
   defect_title: string | null

   operator: OperatorShortRead | null
}
