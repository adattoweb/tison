export interface DefectsByOperationTypeRead {
   operation_type_id: number
   name: string
   color: string // hex, напр. "#c0392b"
   defects_count: number
}

export interface DefectsOverview {
   total: number
   created_today: number
   open_count: number
   closed_count: number
   critical_count: number
   average_resolution_hours: number | null
}
