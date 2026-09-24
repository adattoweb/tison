export interface EmployeeRankingEntry {
   place: number
   user_id: string
   first_name: string
   last_name: string
   position: string | null
   points: number
   points_today: number
}

export interface EmployeeRanking {
   entries: EmployeeRankingEntry[]
   my_rank: EmployeeRankingEntry | null
}

export type EmployeeActivityEventType =
   | "product_created"
   | "operation_started"
   | "operation_ended"
   | "session_started"
   | "session_ended"
   | "defect_opened"
   | "defect_closed"

export type SessionResult = "paused" | "completed" | "cancelled"

export interface EmployeeActivityEvent {
   type: EmployeeActivityEventType
   at: string // ISO datetime

   product_id: number | null
   product_code: string | null

   operation_id: number | null
   operation_code: string | null
   operation_type_id: number | null
   operation_type_name: string | null

   work_session_id: string | null
   station_id: number | null
   station_code: string | null
   result: SessionResult | null

   defect_id: number | null
   defect_code: string | null
   defect_title: string | null
}

export interface EmployeeActivityPage {
   items: EmployeeActivityEvent[]
   total: number
   page: number
   page_size: number
}
