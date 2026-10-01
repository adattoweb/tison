import type { OperationListRead } from "./operation"
import type { StationListRead } from "./station"

export interface WorkSessionOperationShort {
   id: number
   code: string
   operation_type: { id: number; name: string }
   product: { id: number; code: string } | null
}

export interface WorkSessionStationShort {
   id: number
   code: string
}

export interface StationWorkSessionListRead {
   id: string
   operator_id: string
   started_at: string
   end_at: string | null
   result: string | null
   note: string | null
   operation: WorkSessionOperationShort
   station: WorkSessionStationShort
}

export type SessionStatus = "PAUSED" | "COMPLETED" | "CANCELLED"

export interface WorkSessionListRead {
   id: string
   operation_id: number
   operator_id: string
   station_id: number
   started_at: string
   end_at: string | null
   result: SessionStatus | null
   note: string | null
}

export interface WorkSessionRead extends WorkSessionListRead {
   operation: OperationListRead
   station: StationListRead
}

export interface WorkSessionResponse {
   id: string
   station_id: number
   operation_id: number
   note: string | null
}
