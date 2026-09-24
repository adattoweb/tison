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
