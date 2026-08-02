export type ProductStatus = "onTrack" | "atRisk" | "notStarted"

export interface ProductStat {
   id: string
   name: string
   model: string
   plan: number
   inProgress: number
   completed: number
   progress: number
   status: ProductStatus
}

export interface StatusConfig {
   label: string
   color: string
}

export const STATUS_CONFIG: Record<ProductStatus, StatusConfig> = {
   onTrack: { label: "В процесі", color: "#4a9d5c" },
   atRisk: { label: "В процесі", color: "#e8ba6f" },
   notStarted: { label: "Не розпочато", color: "#6b6b6b" },
}

export const mockProducts: ProductStat[] = [
   {
      id: "1",
      name: "Корпус A",
      model: "Модель A-12",
      plan: 120,
      inProgress: 80,
      completed: 75,
      progress: 62,
      status: "onTrack",
   },
   {
      id: "2",
      name: "Модуль B",
      model: "Модель B-7",
      plan: 80,
      inProgress: 50,
      completed: 30,
      progress: 37,
      status: "atRisk",
   },
   {
      id: "3",
      name: "Плата C",
      model: "Модель C-3",
      plan: 60,
      inProgress: 40,
      completed: 40,
      progress: 67,
      status: "onTrack",
   },
   {
      id: "4",
      name: "Блок D",
      model: "Модель D-9",
      plan: 40,
      inProgress: 16,
      completed: 16,
      progress: 40,
      status: "onTrack",
   },
   {
      id: "5",
      name: "Пристрій E",
      model: "Модель E-1",
      plan: 20,
      inProgress: 0,
      completed: 0,
      progress: 0,
      status: "notStarted",
   },
]

/** Widget shows a short preview list; the rest lives on the dedicated /planning page */
export const PLANNING_PREVIEW_LIMIT = 5
