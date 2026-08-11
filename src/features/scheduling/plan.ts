export interface Plan {
   model: string
   startAt: string
   endAt: string
   plan: number
   fact: number
}

export const mockPlan: Plan[] = [
   {
      model: "Плата керування V4",
      startAt: "10.08.2026",
      endAt: "12.08.2026",
      plan: 100,
      fact: 25,
   },
   {
      model: "Плата керування V4",
      startAt: "10.08.2026",
      endAt: "12.08.2026",
      plan: 125,
      fact: 125,
   },
   {
      model: "Плата керування V1",
      startAt: "12.08.2026",
      endAt: "14.08.2026",
      plan: 100,
      fact: 100,
   },
   {
      model: "Плата керування V2",
      startAt: "14.08.2026",
      endAt: "16.08.2026",
      plan: 100,
      fact: 100,
   },
   {
      model: "Плата керування V5",
      startAt: "15.08.2026",
      endAt: "20.08.2026",
      plan: 38,
      fact: 28,
   },
]
