export interface ShiftBase {
   name: string
   start_at: string // "HH:MM:SS"
   end_at: string
   working_days: number[]
   break_minutes: number
}

export interface ScheduleItem {
   order_id: number
   product_model_id: number
   product_model_title: string

   is_overdue: boolean
   planned_end_at: string

   unit_minutes: number
   assigned_quantity: number
   scheduled_quantity: number
   carried_over_quantity: number

   start_at: string | null
   end_at: string | null
}

export interface SkippedOrder {
   order_id: number
   product_model_title: string
   reason: string
}

export interface OperatorDailySchedule {
   user_id: string
   date: string
   shift: ShiftBase
   is_working_day: boolean
   total_scheduled_quantity: number
   items: ScheduleItem[]
   skipped: SkippedOrder[]
}
