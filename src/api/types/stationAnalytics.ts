import type { OperatorShortRead } from "./productionAnalytics"

export interface StationWorkloadPoint {
   date: string // "YYYY-MM-DD"
   hour: number // 0-23
   worked_minutes: number
   capacity_minutes: number
   percent: number
}

export interface StationWorkloadPage {
   items: StationWorkloadPoint[]
   page: number
   total_days: number
   total_pages: number
}

export type StationRuntimeStatus = "active" | "inactive"

export interface StationCurrentTask {
   operation_id: number
   operation_type_name: string
   product_id: number
   product_code: string
}

export interface StationSummary {
   status: StationRuntimeStatus
   workload_percent: number | null
   department_name: string
   department_description: string | null
   current_task: StationCurrentTask | null
   operator: OperatorShortRead | null
}

export interface TopStation {
   id: number
   code: string
   workload_percent: number
   diff_from_rest_percent: number
}

export interface StationsOverview {
   total: number
   active: number
   idle: number
   average_workload_percent: number
   top_station: TopStation | null
}
