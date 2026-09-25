export interface ProductModelCount {
   product_model_id: number
   title: string
   count: number
}

export interface ProductModelDuration {
   product_model_id: number
   title: string
   average_minutes: number
}

export interface ProductModelsOverview {
   most_produced: ProductModelCount | null
   fastest: ProductModelDuration | null
   slowest: ProductModelDuration | null
   average_duration_minutes: number | null
   defects_percent: number | null
}
