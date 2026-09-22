import type { ShiftRead } from "./shift"

export interface ProfileRead {
   id: number
   user_id: string
   created_at: string
   code: string
   email: string

   salary: number
   points: number

   first_name: string
   middle_name: string
   last_name: string
   telegram: string | null
   phone: string | null

   position: string | null
   shift_id: number | null
   shift: ShiftRead
}
