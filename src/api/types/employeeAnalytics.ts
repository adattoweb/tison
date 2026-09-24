export interface EmployeeRankingEntry {
   place: number
   user_id: string
   first_name: string
   last_name: string
   position: string | null
   points: number
   points_today: number
}

export interface EmployeeRanking {
   entries: EmployeeRankingEntry[]
   my_rank: EmployeeRankingEntry | null
}
