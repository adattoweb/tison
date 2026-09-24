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
