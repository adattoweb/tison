export interface OperationsOverview {
   total: number
   created_today: number

   active_count: number
   active_percent_of_today: number

   average_duration_minutes: number | null

   most_frequent_operation_type_name: string | null
   most_frequent_operation_type_percent: number | null

   completed_today: number
}
