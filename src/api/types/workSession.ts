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
