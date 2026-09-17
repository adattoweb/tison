import type { DepartmentRead } from "./department"

export interface StationListRead {
   id: number
   code: string
   description: string | null
   launched_at: string
   start_at: string
   end_at: string
   status: string
   department_id: number
   responsible_id: string | null
   department: DepartmentRead
}

export interface StationCreatePayload {
   department_id: number
   responsible_id?: string | null
   description?: string | null
   start_at?: string | null
   end_at?: string | null
}
