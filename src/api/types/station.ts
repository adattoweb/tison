export interface StationListRead {
   id: number
   code: string
   description: string | null
   launched_at: string
   start_at: string
   end_at: string
   status: string
   department_id: number
   responsible_id: number | null
}
