export type DefectStatusType = "OPEN" | "CLOSE"

export interface DefectRead {
   id: number
   code: string
   operation_id: number
   title: string
   description: string
   images: string[] | null
   start_at: string
   end_at: string | null
   status: DefectStatusType
   operator_id: string
}
