export interface OperationTypeCount {
   operation_type_id: number
   name: string
   count: number
}

export interface OperationTypeDuration {
   operation_type_id: number
   name: string
   average_minutes: number
}

export interface OperationTypesOverview {
   total_types: number
   most_frequent: OperationTypeCount | null
   most_defects: OperationTypeCount | null
   fastest: OperationTypeDuration | null
   slowest: OperationTypeDuration | null
}
